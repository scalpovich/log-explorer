import {Component} from "react";
import React from "react";
import './css/FileView.css';
import './css/Filters.css';
import './css/helper.css';
import ReactDOM from "react-dom";
import App from "./App";
import Filters from "./Filters"
import FileContents from "./FileContents"
import AddFilterModal from "./AddFilterModal"

let fs = window.require('fs');
const path = window.require('path');

let fileName = '';
let fileData = [];

function getFilters() {
  return JSON.parse(localStorage.getItem(fileName) || "[]");
}

class FileView extends Component {

  constructor(props) {
    super(props);
    fileName = props.fileName;
    this.state = {
      fileName: props.fileName,
      fileData: [],
      selectedLine: null,
      filters: [],
      filtersApplied: true,
      showOnlyFiltered: false,
      addFilterModal : {
        open: false
      }
    };
    this.readFileData();
    window.require('electron').ipcRenderer.on('keyPress', (event, message) => {
      switch (message) {
        case 'CommandOrControl+H':
          this.setState(state => {
            state.showOnlyFiltered = !state.showOnlyFiltered;
            return state;
          });
          break;
        case 'CommandOrControl+N':
          this.setState({
            addFilterModal: {
              open: true
            }
          });
          break;
        case 'Up':
          this.selectAdjLine(false);
          break;
        case 'Down':
          this.selectAdjLine(true);
          break;
        default:
          break;
      }
    });
  }

  close() {
    ReactDOM.render(<App/>, document.getElementById('root'));
  }

  readFileData() {
    fs.readFile(this.state.fileName, 'utf-8', (err, data) => {
      if (err) {
        alert('cannot open file ' + err);
        return;
      }
      fileData = data.split('\n')
        .filter(line => !!line)
        .map((line, i) => {
          return {
            key: i + 1,
            text: line,
            selected: false,
            className: '',
            filterMatch: false,
            exclude: false
          };
        });
      this.setState({
        fileData: fileData
      });
      this.filterChanged();
    });
  }

  selectAdjLine(next) {
    let targetLine = null;
    let visibleLines = this.state.showOnlyFiltered ? fileData.filter(f => f.filterMatch) : fileData;
    if (this.state.selectedLine) {
      let index = visibleLines.indexOf(this.state.selectedLine);
      if (next) {
        targetLine = index < visibleLines.length ? visibleLines[index + 1] : this.state.selectedLine;
      } else {
        targetLine = index > 0 ? visibleLines[index - 1] : this.state.selectedLine;
      }
    } else if (visibleLines.length) {
      targetLine = visibleLines[0];
    }
    this.lineClickHandler(targetLine);
  }

  lineClickHandler(line) {
    this.setState(state => {
      if (state.selectedLine && state.selectedLine.selected){
        state.selectedLine.selected = false;
        if (state.selectedLine.key === line.key) {
          return state;
        }
      }
      state.selectedLine = line;
      state.selectedLine.selected = true;
      return state;
    });
  }

  lineDoubleClickHandler(line) {
    this.setState({
      addFilterModal: {
        open: true,
        text: line.text
      }
    });
  }

  closeAddFilterModal() {
    this.setState({
      addFilterModal: {
        open: false
      }
    });
  }

  filterChanged() {
    let allFilters = getFilters();
    this.setState({
      filters: allFilters,
      filtersApplied: allFilters.filter(f => f.enabled).length > 0
    });

    let filters = allFilters.filter(f => f.enabled);
    fileData.forEach(line => {
      let filter = filters.find(f => line.text.toLowerCase().match(f.text.toLowerCase()));
      line.filterMatch = !!filter;
      line.className = line.filterMatch ? filter.class : '';
      line.exclude = line.filterMatch ? filter.exclude: false;
    });
    this.setState({
      fileData: fileData
    });
  }

  filterDoubleClickHandler(filter) {
    this.setState({
      addFilterModal: {
        open: true,
        key: filter.key
      }
    });
  }

  render() {
    return (
      <div id="analyzer">
        <div className="top-bar">
          <div className={"clearfix"}>
            <div className={"file-name"}>{path.basename(this.state.fileName)}</div>
            <div className={"pull-right"}>
              <button className="close-file" onClick={this.close}>Close</button>
            </div>
          </div>
        </div>
        <FileContents fileData={this.state.fileData}
                      filtersApplied={this.state.filtersApplied}
                      showOnlyFiltered={this.state.showOnlyFiltered}
                      lineClickHandler={this.lineClickHandler.bind(this)}
                      lineDoubleClickHandler={this.lineDoubleClickHandler.bind(this)}/>
        <Filters filters={this.state.filters}
                 fileName={this.state.fileName}
                 getFilters={getFilters}
                 filterDoubleClickHandler={this.filterDoubleClickHandler.bind(this)}
                 filterChanged={this.filterChanged.bind(this)} />
        <AddFilterModal args={this.state.addFilterModal}
                        fileName={this.state.fileName}
                        fileData={this.state.fileData}
                        getFilters={getFilters}
                        filterChanged={this.filterChanged.bind(this)}
                        closeModal={this.closeAddFilterModal.bind(this)} />
        {
          this.state.fileData.length === 0 &&
          <div id="loading">
            <h2>File is empty</h2>
          </div>
        }
      </div>
    );
  }
}

export default FileView;