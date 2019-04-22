import {Component} from "react";
import React from "react";

class LogEntry extends Component {
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
    let handleRowClick = () => this.props.lineClickHandler(this.state.line);
    let handleDoubleClick = () => this.props.lineDoubleClickHandler(this.state.line);
    const filterMatch = this.state.line.filterMatch && !this.state.line.exclude;
    return (
      <tr onClick={handleRowClick}
          className={filterMatch ? 'row-filter-match': ''}>
        <td className="line-no">
          <pre>{this.state.line.key}</pre>
        </td>
        <td className={"line"}>
          <pre className={this.state.line.className +
          (this.state.line.selected ? ' selected ' : ' ') +
          (filterMatch ? 'filter-match ' : ' ')} onDoubleClick={handleDoubleClick}>{this.state.line.text}</pre>
        </td>
      </tr>
    );
  }
}

export default LogEntry;