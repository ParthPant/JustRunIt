import React, { Component } from "react";
import AceEditor from "react-ace";
import styled from "styled-components";
import Logo from "../../images/logo.svg"
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";

const ContainerDiv = styled.div`
  background: #161f2e;
  width: 100%;
  height: 100%;
  .heading{
    color: white;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;

  .btn {
    background: #7aeb34;
    width: 10em;
    height: 3em;
    border-radius: 0.5em;
    margin: 0 5px;
    font-family: "Open Sans", sans-serif;
    input {
      background-image: none;
      font-weight: bold;
      height: 100%;
      font-family: "Open Sans", sans-serif;
      width: 100%;
      cursor: pointer;
      appearance: none;
      box-shadow: none;
      border: none;
    }
  }
  .select {
    display: flex;
    width: 20em;
    height: 3em;
    line-height: 3;
    background: #5c6664;
    overflow: hidden;
    position: relative;
    border-radius: 0.25em;
    select {
      appearance: none;
      outline: 0;
      box-shadow: none;
      border: 0 !important;
      background: #5c6664;
      background-image: none;
      flex: 1;
      padding: 0 0.5em;
      color: #fff;
      cursor: pointer;
      font-size: 1em;
      font-family: "Open Sans", sans-serif;
    }
    &::after {
      content: "";
      position: absolute;
      right: 0;
      padding: 0 1em;
      background: #2b2e2e;
      cursor: pointer;
      pointer-events: none;
    }
    &:hover::after {
      color: #23b499;
    }
  }
`;

const EditorFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  .outputDiv {
    flex: 1 1 300px;
    margin: 5px;
  }
  .codeDiv {
    flex: 1 1 300px;
    margin: 5px;
  }
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      code: "",
      lang: "c++",
      output: "",
      mode: "c_cpp"
    };

    this.handelGoButton = this.handelGoButton.bind(this);
    this.handleAceChange = this.handleAceChange.bind(this);
    this.handleLangChange = this.handleLangChange.bind(this);
  }

  handelGoButton() {
    //handle compile code
    this.setState({ output: "" });
    const requestOptions = {
      crossDomain: true,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    };
    fetch("http://localhost:3000/run", requestOptions)
      .then(res => res.text())
      .then(data => {
        this.setState({ output: data });
      });
  }

  handleLangChange(event) {
    let mode;
    let lang = event.target.value;
    console.log(lang);
    if (lang == "c++" || lang == "c") mode = "c_cpp";
    else if (lang == "python") mode = "python";
    else if (lang == "nodejs") mode = "javascript";
    console.log(mode);
    this.setState({ lang: event.target.value, mode: mode });
  }

  handleAceChange(newValue) {
    this.setState({ code: newValue });
  }

  render() {
    return (
      <ContainerDiv>
        <Logo height='80px'  width="auto" preserveAspectRatio="none"/>
        <Controls>
          <div className="select">
            <select
              name="laguages"
              onChange={this.handleLangChange}
              value={this.state.lang}
            >
              <option value="c++">C++</option>
              <option value="c">C</option>
              <option value="python">Python</option>
              <option value="nodejs">Node JS</option>
            </select>
          </div>
          <div className="btn">
            <input
              className="btn"
              type="button"
              value="Run"
              onClick={this.handelGoButton}
            />
          </div>
        </Controls>
        <br />
        <EditorFlex>
          <div className="codeDiv">
            <AceEditor
              onChange={this.handleAceChange}
              theme="monokai"
              defaultValue="Write your code here"
              mode={this.state.mode}
              width="100%"
              showPrintMargin={true}
            />
          </div>
          <div className="outputDiv">
            <AceEditor
              value={this.state.output || "Output will be shown here"}
              readOnly={true}
              theme="monokai"
              width="100%"
              showPrintMargin={false}
            />
          </div>
        </EditorFlex>
      </ContainerDiv>
    );
  }
}

export default App;
