import React, { Component } from 'react';
import './css/App.css';
import ReactDOM from "react-dom";
import FileView from "./FileView";
const {remote, ipcRenderer} = window.require('electron');

const dialog = remote.dialog;

ipcRenderer.on('keyPress', (event, message) => {
  switch (message) {
    case 'CommandOrControl+O':
      openFileDialog();
      break;
    default:
      break;
  }
});

ipcRenderer.on('open-file', (event, path) => {
  ReactDOM.render(<FileView fileName={path} />, document.getElementById('root'));
});

function openFileDialog() {
  dialog.showOpenDialog(fileNames => {
    if (fileNames === undefined) {
      return;
    }
    // ReactDOM.render(<App/>, document.getElementById('root'));
    ReactDOM.render(<FileView fileName={fileNames[0]} />, document.getElementById('root'));
  });
}

export default class App extends Component {
  componentDidMount() {
    document.title = `Log Explorer`;
  }

  render() {
    return (
      <div id="open-file-container">
        <h1>Log Explorer</h1>
        <input type="button" id="btn-readfile" value="Click to select file" onClick={openFileDialog} />
      </div>
    );
  }
}