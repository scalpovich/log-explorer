import React, { Component } from 'react';
import './css/App.css';
import ReactDOM from "react-dom";
import FileView from "./FileView";
const {remote} = window.require('electron');

const dialog = remote.dialog;

window.require('electron').ipcRenderer.on('keyPress', (event, message) => {
  switch (message) {
    case 'CommandOrControl+O':
      openFileDialog();
      break;
    default:
      break;
  }
});

function openFileDialog() {
  dialog.showOpenDialog(fileNames => {
    if (fileNames === undefined) {
      return;
    }
    ReactDOM.render(<FileView fileName={fileNames[0]} />, document.getElementById('root'));
  });
}

class App extends Component {

  render() {
    return (
      <div id="open-file-container">
        <h1>Log Analyzer</h1>
        <input type="button" id="btn-readfile" value="Click to select file" onClick={openFileDialog} />
      </div>
    );
  }
}

export default App;
