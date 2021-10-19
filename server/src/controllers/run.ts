import express from 'express'
import path from 'path'
import fs from 'fs'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

const tmpdir = require("os").tmpdir();
const router = express.Router();

router.post("/run", function(req, res) {
  const code: string = unescape(req.body.code);
  const lang: string = req.body.lang;
  const inputs: string = unescape(req.body.inputs);
  getOutput(lang, code, inputs).then(data => {
    res.send(data);
  }).catch(err => {
    console.log(err);
  });
});

function getOutput(lang: string, code: string, inputs: string): Promise<string> {
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
  return Promise.reject("Invalid language");
}

function handelC(code: string, inputs: string, baseDir: string): Promise<string> {
  return new Promise<string>((resolve, _reject) => {
    const options = { cwd: baseDir };
    const filePath = path.join(baseDir, "test.c");
    fs.writeFileSync(filePath, code);
    let response = "";
    const compileProcess = spawn("gcc", ["test.c"], options);
    compileProcess.stderr.on("data", data => (response = data));
    compileProcess.on("close", () => {
      if (response) {
        fs.unlink(filePath, err => {if (err) console.log(err)});
        resolve(response);
      } else {
        const runProcess = spawn("./a.out", options);
        const binPath = path.join(baseDir, 'a.out');
        handleInputs(inputs, runProcess).then(() => {
          runProcess.stdout.on("data", data => { response += data as string });
          runProcess.stderr.on("data", err => { response += err as string });
          runProcess.on("close", () => {
            fs.unlink(filePath, err => {if (err) console.log(err)});
            fs.unlink(binPath, err => {if (err) console.log(err)});
            resolve(response);
          });
        });
      }
    });
  });
}

function handelCpp(code: string, inputs: string, baseDir: string): Promise<string> {
  return new Promise<string>((resolve, _reject) => {
    const options = { cwd: baseDir };
    const filePath = path.join(baseDir, "test.cpp");
    fs.writeFileSync(filePath, code);
    let response = "";
    const compileProcess = spawn("g++", ["test.cpp"], options);
    compileProcess.stderr.on("data", data => (response = data));
    compileProcess.on("close", () => {
      if (response != "") {
        fs.unlink(filePath, err => {if (err) console.log(err)});
        resolve(response);
      } else {
        const runProcess = spawn("./a.out", options);
        const binPath = path.join(baseDir, 'a.out');
        handleInputs(inputs, runProcess).then(() => {
          runProcess.stdout.on("data", data => { response += data as string });
          runProcess.stderr.on("data", err => { response += err as string });
          runProcess.on("close", () => {
            fs.unlink(filePath, err => {if (err) console.log(err)});
            fs.unlink(binPath, err => {if (err) console.log(err)});
            resolve(response);
          });
        });
      }
    });
  });
}

function handelPython(code: string, inputs: string, baseDir: string): Promise<string> {
  return new Promise<string>((resolve, _reject) => {
    const options = { cwd: baseDir };
    const filePath = path.join(baseDir, "test.py");
    fs.writeFileSync(filePath, code);
    const runProcess = spawn("python", ["test.py"], options);
    let response = "";
    handleInputs(inputs, runProcess).then(() => {
      runProcess.stdout.on("data", data => { response += data as string });
      runProcess.stderr.on("data", err => { response += err as string });
      runProcess.on("close", () => {
        fs.unlink(filePath, err => {if (err) console.log(err)});
        resolve(response);
      });
    });
  });
}

function handelNodejs(code: string, inputs: string, baseDir: string): Promise<string> {
  return new Promise<string>((resolve, _reject) => {
    const options = { cwd: baseDir };
    const filePath = path.join(baseDir, "test.js");
    fs.writeFileSync(filePath, code);
    const runProcess = spawn("node", ["test"], options);
    let response = "";
    handleInputs(inputs, runProcess).then(() => { 
      runProcess.stdout.on("data", data => { response += data as string; });
      runProcess.stderr.on("data", err => { response += err as string });
      runProcess.on("close", () => {
        fs.unlink(filePath, err => {if (err) console.log(err)});
        resolve(response);
      });
     });
  });
}

function handleInputs(inputs: string, process: ChildProcessWithoutNullStreams): Promise<null> {
  return new Promise<null>((resolve, _reject) => {
    if (inputs) {
      let input_arr: string[] = inputs.split("\n");
      process.stdin.on("error", err => console.log(err));
      input_arr.forEach(input => {
        process.stdin.write(input + "\n");
      });
      process.stdin.end();
    }
    resolve(null);
  });
}

export {router};
