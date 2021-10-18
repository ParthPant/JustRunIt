const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const tmpdir = require("os").tmpdir();
const spwan = require("child_process").spawn;

router.post("/run", function(req, res) {
  code = unescape(req.body.code);
  const lang = req.body.lang;
  inputs = unescape(req.body.inputs);
  getOutput(lang, code, inputs).then(data => res.send(data));
});

function getOutput(lang, code, inputs) {
  const baseDir = path.join(tmpdir, "JRT");
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
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
  return new Promise((resolve, _reject) => {
    const options = { cwd: baseDir };
    filePath = path.join(baseDir, "test.c");
    fs.writeFileSync(filePath, code, err => {
      if (err) {
        throw err;
      }
    });
    var response = "";
    const compileProcess = spwan("gcc", ["test.c"], options);
    compileProcess.stderr.on("data", data => (response = data));
    compileProcess.on("close", () => {
      if (response) {
        fs.unlink(filePath, err => {if (err) console.log(err)});
        resolve(response);
      } else {
        const runProcess = spwan("./a.out", options);
        handleInputs(inputs, runProcess).then(() => {
          runProcess.stdout.on("data", data => (response += data.toString()));
          runProcess.stderr.on("data", err => (response += err.toString()));
          runProcess.on("close", () => {
            fs.unlink(filePath, err => {if (err) console.log(err)});
            fs.unlink(filePath, err => {if (err) console.log(err)});
            resolve(response);
          });
        });
      }
    });
  });
}

function handelCpp(code, inputs, baseDir) {
  return new Promise((resolve, _reject) => {
    const options = { cwd: baseDir };
    filePath = path.join(baseDir, "test.cpp");
    fs.writeFileSync(filePath, code, err => {
      if (err) {
        throw err;
      }
    });
    var response = "";
    const compileProcess = spwan("g++", ["test.cpp"], options);
    compileProcess.stderr.on("data", data => (response = data));
    compileProcess.on("close", () => {
      if (response) {
        fs.unlink(filePath, err => {if (err) console.log(err)});
        resolve(response);
      } else {
        const runProcess = spwan("./a.out", options);
        handleInputs(inputs, runProcess).then(() => {
          runProcess.stdout.on("data", data => (response += data.toString()));
          runProcess.stderr.on("data", err => (response += err.toString()));
          runProcess.on("close", () => {
            fs.unlink(filePath, err => {if (err) console.log(err)});
            fs.unlink(filePath, err => {if (err) console.log(err)});
            resolve(response);
          });
        });
      }
    });
  });
}

function handelPython(code, inputs, baseDir) {
  return new Promise((resolve, _reject) => {
    const options = { cwd: baseDir };
    filePath = path.join(baseDir, "test.py");
    fs.writeFileSync(filePath, code, err => {
      if (err) {
        throw err;
      }
    });
    const runProcess = spwan("python", ["test.py"], options);
    var response = "";
    handleInputs(inputs, runProcess).then(() => {
      runProcess.stdout.on("data", data => (response += data.toString()));
      runProcess.stderr.on("data", err => (response += err.toString()));
      runProcess.on("close", () => {
        fs.unlink(filePath, err => {if (err) console.log(err)});
        resolve(response);
      });
    });
  });
}

function handelNodejs(code, inputs, baseDir) {
  return new Promise((resolve, _reject) => {
    const options = { cwd: baseDir };
    filePath = path.join(baseDir, "test.js");
    fs.writeFileSync(filePath, code, err => {
      if (err) {
        throw err;
      }
    });
    const runProcess = spwan("node", ["test"], options);
    var response = "";
    handleInputs(inputs, runProcess).then(() => {
      runProcess.stdout.on("data", data => {
        response += data.toString();
      });
      runProcess.stderr.on("data", err => (response += err.toString()));
      runProcess.on("close", () => {
        fs.unlink(filePath, err => {if (err) console.log(err)});
        resolve(response);
      });
    });
  });
}

function handleInputs(inputs, process) {
  return new Promise((resolve, _reject) => {
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
