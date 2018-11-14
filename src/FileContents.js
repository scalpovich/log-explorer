import {Component} from "react";
import React from "react";
import LogEntry from "./LogEntry"

class FileContents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      ...props
    });
  }

  render() {

    return (
      <div id="file-contents">
        <table className={this.state.filtersApplied ? 'filters-applied': ''}
               cellPadding={"0"}>
          <tbody>
          {
            this.state.fileData.map(line => {
              let hideEntry = this.state.showOnlyFiltered && (!line.filterMatch || line.exclude);
              return !hideEntry && <LogEntry line={line}
                               key={line.key}
                               hideEntry={hideEntry}
                               lineClickHandler={this.props.lineClickHandler}
                               lineDoubleClickHandler={this.props.lineDoubleClickHandler} />
            })
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default FileContents;