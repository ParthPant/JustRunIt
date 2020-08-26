const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const homedir = require("os").homedir();
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const spwan = require("child_process").spawn;

router.use(function timeLog(req, res, next) {
  console.log("Time:", Date.now());
  next();
});

router.post("/run", function(req, res) {
  code = unescape(req.body.code);
  const lang = req.body.lang;
  inputs = unescape(req.body.inputs);
  getOutput(lang, code, inputs).then(data => res.send(data));
});

function getOutput(lang, code, inputs) {
  const baseDir = path.join(homedir, "code-tester");
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
    console.log("created test folder");
  } else {
    console.log("test folder exists");
  }
  switch (lang) {
    case "c++":
      return handelCpp(code, inputs, baseDir);
    case "c":
      return handelC(code, inputs, baseDir);
    case "python":
      return handelPython(code, inputs, baseDir);
    case "nodejs":
      return handelNodejs(code, inputs, baseDir);
  }
}

function handelC(code, inputs, baseDir) {
  return new Promise((resolve, reject) => {
    const options = { cwd: baseDir };
    console.log("c test recieved");
    filePath = path.join(baseDir, "test.c");
    fs.writeFileSync(filePath, code, err => {
      if (err) {
        throw err;
      } else {
        console.log("Test file written");
      }
    });
    var response = "";
    const compileProcess = spwan("gcc", ["test.c"], options);
    compileProcess.stderr.on("data", data => (response = data));
    compileProcess.on("close", () => {
      if (response) {
        resolve(response);
      } else {
        const runProcess = spwan("./a.out", options);
        handleInputs(inputs, runProcess).then(() => {
          runProcess.stdout.on("data", data => (response += data.toString()));
          runProcess.stderr.on("data", err => (response += err.toString()));
          runProcess.on("close", () => {
            console.log("------------------end-----------------");
            console.log(response);
            resolve(response);
          });
        });
      }
    });
  });
}

function handelCpp(code, inputs, baseDir) {
  return new Promise((resolve, reject) => {
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
    var response = "";
    const compileProcess = spwan("g++", ["test.cpp"], options);
    compileProcess.stderr.on("data", data => (response = data));
    compileProcess.on("close", () => {
      if (response) {
        resolve(response);
      } else {
        const runProcess = spwan("./a.out", options);
        handleInputs(inputs, runProcess).then(() => {
          runProcess.stdout.on("data", data => (response += data.toString()));
          runProcess.stderr.on("data", err => (response += err.toString()));
          runProcess.on("close", () => {
            console.log("------------------end-----------------");
            console.log(response);
            resolve(response);
          });
        });
      }
    });
  });
}

function handelPython(code, inputs, baseDir) {
  return new Promise((resolve, reject) => {
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
    const runProcess = spwan("python", ["test.py"], options);
    var response = "";
    handleInputs(inputs, runProcess).then(() => {
      runProcess.stdout.on("data", data => (response += data.toString()));
      runProcess.stderr.on("data", err => console.log(err.toString()));
      runProcess.on("close", () => {
        console.log("------------------end-----------------");
        console.log(response);
        resolve(response);
      });
    });
  });
}

function handelNodejs(code, inputs, baseDir) {
  return new Promise((resolve, reject) => {
    const options = { cwd: baseDir };
    console.log("nodejs test recieved");
    filePath = path.join(baseDir, "test.js");
    fs.writeFileSync(filePath, code, err => {
      if (err) {
        throw err;
      } else {
        console.log("Test file written");
      }
    });
    const runProcess = spwan("node", ["test"], options);
    var response = "";
    handleInputs(inputs, runProcess).then(() => {
      runProcess.stdout.on("data", data => {
        response += data.toString();
      });
      runProcess.stderr.on("data", err => console.log(err.toString()));
      runProcess.on("close", () => {
        console.log("------------------end-----------------");
        console.log(response);
        resolve(response);
      });
    });
  });
}

function handleInputs(inputs, process) {
  return new Promise((resolve, reject) => {
    if (inputs) {
      inputs = inputs.split("\n");
      console.log(inputs);
      process.stdin.on("error", err => console.log(err));
      inputs.forEach(input => {
        process.stdin.write(input + "\n");
      });
      process.stdin.end();
    }
    resolve();
  });
}

module.exports = router;
