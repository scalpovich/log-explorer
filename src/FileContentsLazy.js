import {Component} from "react";
import React from "react";
import LogEntry from "./LogEntry"
import InfiniteScroll from "react-infinite-scroller"

class FileContentsLazy extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ...props,
      lines: [],
      hasMoreItems: true
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      ...props
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const fileDataChanged = this.props.fileDataLength !== prevProps.fileDataLength ||
      this.props.showOnlyFiltered !== prevProps.showOnlyFiltered || this.props.filtersApplied !== prevProps.filtersApplied;
    if (fileDataChanged) {
      this.loadItems(0);
    }
  }

  getFilteredData(fileData) {
    return this.props.showOnlyFiltered && this.props.filtersApplied ? fileData.filter(l => l.filterMatch && !l.exclude) : fileData;
  }

  loadItems(page) {
    const pageSize = 100;
    const start = pageSize * page;
    const end = start + pageSize;
    const fileData = this.getFilteredData(this.state.fileData);
    const pagedLines = fileData.slice(start, end);
    if (fileData.length && !pagedLines.length) {
      this.setState({
        hasMoreItems: false
      });
    } else {
      const lines = page === 0 ? pagedLines : this.state.lines.concat(pagedLines);
      this.setState({
        lines,
        hasMoreItems: lines.length > 0
      });
    }
  }

  render() {
    return (
      <div id="file-contents"
           className={(this.state.filtersApplied ? 'filters-applied' : '')}>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadItems.bind(this)}
          hasMore={this.state.hasMoreItems}
          element={"table"}
          useWindow={false}
        >
          <tbody>
          {
            this.state.lines.map(line =>
              <LogEntry line={line}
                        key={line.key}
                        lineClickHandler={this.props.lineClickHandler}
                        lineDoubleClickHandler={this.props.lineDoubleClickHandler}/>
            )
          }
          </tbody>
        </InfiniteScroll>
      </div>
    );
  }
}

export default FileContentsLazy;
