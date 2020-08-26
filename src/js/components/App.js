import React, { Component } from "react";
import AceEditor from "react-ace";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
import Editor from "./Editor";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";

const Holder = styled.div`
  background: #3c3c40;
  position: absolute;
  right: 0;
  left: 0;
  padding: 1em 5em;
  .heading {
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
  render() {
    return (
      <Holder>
        <Header />
        <Editor />
        <Footer />
      </Holder>
    );
  }
}

export default App;
