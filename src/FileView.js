import {Component} from "react";
import React from "react";
import './css/FileView.css';
import './css/helper.css';
import ReactDOM from "react-dom";
import App from "./App";
import Filters from "./Filters"
import FileContents from "./FileContents"
import AddFilterModal from "./AddFilterModal"
import FilterService from "./FilterService";

let fs = window.require('fs');
const path = window.require('path');

let fileName = '';
let fileData = [];

let filterColors = [
  {"name": "Aqua", "style": {"background": "#7FDBFF", "color": "black"}},
  {"name": "Aquamarine", "style": {"background": "aquamarine", "color": "black"}},
  {"name": "Black", "style": {"background": "#111111", "color": "white"}},
  {"name": "Blue", "style": {"background": "#0074D9", "color": "white"}},
  {"name": "Brick-Red", "style": {"background": "firebrick", "color": "white"}},
  {"name": "Fuchsia", "style": {"background": "#F012BE", "color": "white"}},
  {"name": "Green", "style": {"background": "#2ECC40", "color": "white"}},
  {"name": "Lime", "style": {"background": "#01FF70", "color": "black"}},
  {"name": "Maroon", "style": {"background": "#85144B", "color": "white"}},
  {"name": "Navy", "style": {"background": "#001F3F", "color": "white"}},
  {"name": "Olive", "style": {"background": "#3D9970", "color": "white"}},
  {"name": "Orange", "style": {"background": "#FF851B", "color": "white"}},
  {"name": "Purple", "style": {"background": "#B10DC9", "color": "white"}},
  {"name": "Red", "style": {"background": "#FF4136", "color": "white"}},
  {"name": "Royal-Blue", "style": {"background": "royalblue", "color": "white"}},
  {"name": "Teal", "style": {"background": "#39CCCC", "color": "black"}},
  {"name": "Yellow", "style": {"background": "#FFDC00", "color": "black"}}
];

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
      addFilterModal: {
        open: false
      }
    };
    this.readFileData();
    window.require('electron').ipcRenderer.on('keyPress', (event, message) => {
      switch (message) {
        case 'CommandOrControl+H':
          this.toggleShowOnlyFiltered();
          break;
        case 'CommandOrControl+N':
          this.setState({
            addFilterModal: {
              open: true
            }
          });
          break;
        case 'CommandOrControl+W':
          this.close();
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

  componentDidMount() {
    document.title = `Log Explorer - ${path.basename(fileName)}`;
    if (!document.getElementById('filters-style')) {
      let styleNode = document.createElement('style',);
      styleNode.id = 'filters-style';
      styleNode.type = "text/css";
      let classes = filterColors.map((color, i) => {
        return `.filter-color-${i} {
          background-color: ${color.style.background};
          color: ${color.style.color} !important;
        }`
      });
      styleNode.appendChild(document.createTextNode(classes.join('\n')));
      document.getElementsByTagName('head')[0].appendChild(styleNode);
    }
  }

  toggleShowOnlyFiltered() {
    this.setState(state => {
      state.showOnlyFiltered = !state.showOnlyFiltered;
      this.showOnlyFilteredCheck.checked = state.showOnlyFiltered;
      return state;
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
      if (state.selectedLine && state.selectedLine.selected) {
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
    this.applyFilters();
  }

  applyFilters() {
    let allFilters = getFilters();
    let filters = allFilters.filter(f => f.enabled && !f.exclude);
    let excludeFilters = allFilters.filter(f => f.enabled && f.exclude);
    fileData.forEach(line => {
      let predicate = f => FilterService.matchesFilter(f.caseSensitive, line, f.text);
      let filter = filters.find(predicate);
      let excludeFilter = excludeFilters.find(predicate);
      if (excludeFilters.length && excludeFilter) {
        line.filterMatch = false;
        line.className = '';
        line.exclude = true;
        return;
      }
      if (filters.length) {
        line.filterMatch = !!filter;
        line.className = line.filterMatch ? filter.class : '';
        line.exclude = line.filterMatch ? filter.exclude : false;
        return;
      }
      line.filterMatch = true;
      line.className = '';
      line.exclude = false;
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
            <div className={"pull-left"}>
              <div className={"file-name"}>{path.basename(this.state.fileName)}</div>
            </div>
            <div className={"pull-right"}>
              <span className={"mright"}>
                <label className={"font-lvl-3"}>
                  <input type="checkbox" onChange={this.toggleShowOnlyFiltered.bind(this)}
                         ref={(input) => this.showOnlyFilteredCheck = input}/>
                  Show Filtered Only
                </label>
              </span>
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
                 filterChanged={this.filterChanged.bind(this)}/>
        <AddFilterModal args={this.state.addFilterModal}
                        fileName={this.state.fileName}
                        fileData={this.state.fileData}
                        getFilters={getFilters}
                        filterColors={filterColors}
                        filterChanged={this.filterChanged.bind(this)}
                        closeModal={this.closeAddFilterModal.bind(this)}/>
        {
          this.state.fileData.length === 0 &&
          <div id="loading">
            <h2>Loading File</h2>
          </div>
        }
      </div>
    );
  }
}

export default FileView;