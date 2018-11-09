import {Component} from "react";
import React from "react";
import './css/FileView.css';
import './css/helper.css';
import ReactDOM from "react-dom";
import App from "./App";
import Filters from "./Filters"
import FileContents from "./FileContents"
import AddFilterModal from "./AddFilterModal"

let fs = window.require('fs');

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
      addFilterModalOpen: false,
      filters: [],
      filtersApplied: true,
      showOnlyFiltered: false
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
            addFilterModalOpen: true
          });
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
            filterMatch: false
          };
        });
      this.setState({
        fileData: fileData
      });
      this.filterChanged();
    });
  }

  lineClickHandler(line) {
    this.setState(state => {
      if (state.selectedLine)
        state.selectedLine.selected = false;
      state.selectedLine = line;
      state.selectedLine.selected = true;
      return state;
    });
  }

  lineDoubleClickHandler(line) {
    this.setState({
      addFilterModalOpen: true,
      addFilterModalText: line.text
    });
  }

  closeAddFilterModal() {
    this.setState({
      addFilterModalOpen: false
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
      if (filter) {
        line.filterMatch = true;
        line.className = filter.class
      } else {
        line.className = '';
        line.filterMatch = false;
      }
    });
    this.setState({
      fileData: fileData
    });
  }

  render() {
    return (
      <div id="analyzer">
        <div className="top-bar">
          <div className={"clearfix"}>
            <div className={"pull-left"}>{this.state.fileName}</div>
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
                 filterChanged={this.filterChanged.bind(this)} />
        <AddFilterModal open={this.state.addFilterModalOpen}
                        text={this.state.addFilterModalText}
                        fileName={this.state.fileName}
                        fileData={this.state.fileData}
                        getFilters={getFilters}
                        filterChanged={this.filterChanged.bind(this)}
                        closeModal={this.closeAddFilterModal.bind(this)} />
        {
          this.state.fileData.length === 0 &&
          <div id="loading">
            <h2>Loading File...</h2>
          </div>
        }
      </div>
    );
  }
}

export default FileView;