const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const homedir = require("os").homedir();
const util = require("util");
const exec = util.promisify(require("child_process").exec);

router.use(function timeLog(req, res, next) {
  console.log("Time:", Date.now());
  next();
});

router.post("/run", function(req, res) {
  code = unescape(req.body.code);
  const lang = req.body.lang;
  getOutput(lang, code).then(stdout => res.send(stdout));
});

function getOutput(lang, code) {
  const baseDir = path.join(homedir, "code-tester");
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
    console.log("created test folder");
  } else {
    console.log("test folder exists");
  }
  switch (lang) {
    case "c++":
      return handelCpp(code, baseDir);
    case "python":
      return handelPython(code, baseDir);
  }
}

async function handelCpp(code, baseDir) {
  const options = { cwd: baseDir };
  console.log("c++ test recieved");
  filePath = path.join(baseDir, "test.cpp");
  fs.writeFileSync(filePath, code, err => {
    if (err) {
      throw err;
    } else {
      console.log("Test file written");
    }
  });
  try {
    var { stderr, stdout } = await exec("g++ test.cpp", options);
    console.log("compiled");
    ({ stderr, stdout } = await exec("./a.out", options));
    return stdout;
  } catch (err) {
    console.log("---------err-----------");
    console.log(err.stderr);
    return err.stderr;
  }
}

async function handelPython(code, baseDir) {
  const options = { cwd: baseDir };
  console.log("python test recieved");
  filePath = path.join(baseDir, "test.py");
  fs.writeFileSync(filePath, code, err => {
    if (err) {
      throw err;
    } else {
      console.log("Test file written");
    }
  });
  try {
    var { stderr, stdout } = await exec("python test.py", options);
    return stdout;
  } catch (err) {
    console.log("---------err-----------");
    console.log(err.stderr);
    return err.stderr;
  }
}
module.exports = router;
