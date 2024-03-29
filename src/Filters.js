import {Component} from "react";
import React from "react";
import Filter from "./Filter"

class Filters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props
    };
  }

  deleteFilter() {
    let filters = this.props.getFilters();
    let filter = filters.find(f => f.selected);
    if (filter) {
      filters.splice( filters.indexOf(filter), 1 );
      localStorage[this.state.fileName] = JSON.stringify(filters);
      this.props.filterChanged();
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      ...props
    });
  }

  render() {
    return (
      <div id="filters" className="pall-5">
        <h2 className="mtop-5 mbm-5">Filters</h2>
        <table>
          <thead>
            <tr>
              <th>Enable</th>
              <th>Up</th>
              <th>Down</th>
              <th>Del?</th>
              <th>Cond.</th>
              <th>Text</th>
              <th>Matches</th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.filters.map((filter, index) => {
              return <Filter filter={filter}
                             key={filter.key}
                             filterIndex={index}
                             totalFilters={this.state.filters.length}
                             fileName={this.state.fileName}
                             getFilters={this.props.getFilters}
                             deleteFilter={this.deleteFilter.bind(this)}
                             filterDoubleClickHandler={this.props.filterDoubleClickHandler}
                             filterChanged={this.props.filterChanged} />
            })
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default Filters;