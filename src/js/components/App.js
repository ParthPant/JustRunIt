import React, { Component } from "react";

class App extends Component {
  constructor(){
    super()
    this.state = {
      code: '',
      lang: 'c++',
      output: ''
    }
    
    this.handelGoButton = this.handelGoButton.bind(this)
    this.handleCodeChange = this.handleCodeChange.bind(this)
    this.handleLangChange = this.handleLangChange.bind(this)
  }

  handelGoButton() {
    //handle compile code
    const requestOptions = {
      crossDomain: true,
      method: 'POST',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify(this.state)
    }
    fetch('http://localhost:3000/run', requestOptions)
      .then(res => res.text())
      .then(data => {this.setState({output: data})
      })
  }

  handleLangChange(event){
    this.setState({lang: event.target.value})
  }

  handleCodeChange(event){
    this.setState({code: event.target.value})
  }

  render() {
    return (
      <div>
        <h1>Code-Tester</h1>
        <select name='laguages' onChange={this.handleLangChange} value={this.state.lang}>
          <option value='c++'>c++</option>
          <option value='python'>python</option>
        </select>
        <br/>
        <textarea id='code' name='code' rows='12' cols='50' value={this.state.code} onChange={this.handleCodeChange}></textarea>
        <br/>
        <input type='button' value='Go' onClick={this.handelGoButton}/>
        <div style={{whiteSpace:'pre-wrap'}}>{this.state.output}</div>
      </div>
    )
  }
}

export default App
