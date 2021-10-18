import React, { Component } from "react";
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  right: 0;
  left: 0;
  padding-top: 1em;
  padding-bottom: 0;
  padding-right: 5em;
  padding-left: 5em;
  .heading {
    color: white;
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
