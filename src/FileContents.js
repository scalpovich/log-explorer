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
        <table className={this.state.filtersApplied ? 'filters-applied': ''}>
          <tbody>
          {
            this.state.fileData.map(line => {
              return <LogEntry line={line}
                               key={line.key}
                               showOnlyFiltered={this.state.showOnlyFiltered}
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