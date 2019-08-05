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
      <div id="file-contents" className={(this.state.filtersApplied ? 'filters-applied': '')}>
        <table className={(this.state.showOnlyFiltered ? ' show-only-filtered': '')}
               cellPadding={"0"}>
          <tbody>
          {
            this.state.fileData.map(line => {
              return <LogEntry line={line}
                               key={line.key}
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
