import React, { Component } from "react";
import AceEditor from "react-ace";
import styled from "styled-components";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";

const ContainerDiv = styled.div``;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  .btn {
    width: 10em;
    height: 3em;
    text-align: center;
    border-radius: 0.5em;
    margin: 0 1em;
    font-family: "Open Sans", sans-serif;
    input {
      background: #7aeb34;
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
      content: "▼";
      position: absolute;
      right: 0;
      color: white;
      padding: 0 1em;
      background: #2b2e2e;
      cursor: pointer;
      pointer-events: none;
      transition: 0.5s;
    }
    &:hover::after {
      color: #23b499;
      transition: 0.5s;
    }
  }
`;

const EditorFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  .outputDiv {
    flex: 1 1 300px;
    margin: 0 0 0 1em;
  }
  .codeDiv {
    flex: 1 1 300px;
    margin: 0 1em 0 0;

    .aceInputsContainer{
      display:flex;
      flex-direction:column;
      .codeAce{
        margin-bottom: 0.5em;
      }
      .inputsAce{
        margin-top: 0.5em;
      }
    }
  }
`;

const font_size = 15;
export default class Editor extends Component {
  constructor() {
    super();
    this.state = {
      code: "",
      lang: "c++",
      output: "",
      mode: "c_cpp",
      inputs: ""
    };
    this.handelGoButton = this.handelGoButton.bind(this);
    this.handleAceChange = this.handleAceChange.bind(this);
    this.handleLangChange = this.handleLangChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handelGoButton() {
    //handle compile code

    // get relevant data to pass on to the server
    let req_data = (({code, lang, output, inputs}) => ({code, lang, output, inputs}))(this.state);

    this.setState({ output: "" });
    const requestOptions = {
      crossDomain: true,
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(req_data)
    };

    fetch("https://just-run-it.herokuapp.com/run", requestOptions)
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

  handleInputChange(newValue){
    console.log(newValue)
    this.setState({inputs: newValue})
  }
  render() {
    return (
      <ContainerDiv>
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
            <div className='aceInputsContainer'>
              <AceEditor
                onChange={this.handleAceChange}
                className='codeAce'
                theme="monokai"
                defaultValue="Write your code here"
                mode={this.state.mode}
                width="100%"
                fontSize={font_size}
                showPrintMargin={true}
              />
              <AceEditor
                onChange={this.handleInputChange}
                className='inputsAce'
                theme="monokai"
                width="100%"
                height="300px"
                fontSize={font_size}
                showPrintMargin={false}
              />
            </div>
          </div>
          <div className="outputDiv">
            <AceEditor
              value={this.state.output || "Output will be shown here"}
              readOnly={true}
              theme="monokai"
              width="100%"
              height="100%"
              fontSize={font_size}
              showPrintMargin={false}
            />
          </div>
        </EditorFlex>
      </ContainerDiv>
    );
  }
}
