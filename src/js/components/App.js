import React, { Component } from "react";
import AceEditor from "react-ace";

class App extends Component {
  constructor() {
    super();
    this.state = {
      code: "",
      lang: "c++",
      output: ""
    };

    this.handelGoButton = this.handelGoButton.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleLangChange = this.handleLangChange.bind(this);
  }

  handelGoButton() {
    //handle compile code
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
    this.setState({ lang: event.target.value });
  }

  handleCodeChange(event) {
    this.setState({ code: event.target.value });
  }

  render() {
    return (
      <div>
        <h1>Code-Tester</h1>
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
        <br />
        {/*
        <AceEditor
        mode='c++'
        theme="github" 
        onChange={this.handleLangChange}
        value={this.state.code}
        />
      */}
        <textarea
          onChange={this.handleCodeChange}
          value={this.state.code}
          rows="20"
          cols="40"
        />
        <br />
        <input type="button" value="Go" onClick={this.handelGoButton} />
        <div style={{ whiteSpace: "pre-wrap" }}>{this.state.output}</div>
      </div>
    );
  }
}

export default App;
