import {Component} from "react";
import React from "react";

class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      ...props
    });
  }

  toggleFilter(filter) {
    let filters = this.props.getFilters();
    let f = filters.find(f => f.key === filter.key);
    f.enabled = !f.enabled;
    localStorage[this.state.fileName] = JSON.stringify(filters);
    this.props.filterChanged();
  }

  select(filter) {
    let filters = this.props.getFilters();
    filters.forEach(f => f.selected = false);
    let f = filters.find(f => f.key === filter.key);
    f.selected = !f.selected;
    localStorage[this.state.fileName] = JSON.stringify(filters);
    this.props.filterChanged();
  }

  render () {
    let toggleFilter = () => this.toggleFilter(this.state.filter);
    let select = () => this.select(this.state.filter);

    return (
      <tr className={'filter ' + this.state.filter.class + (this.state.filter.selected ? ' selected' : ' ')}>
        <td width="50px;">
          <input type="checkbox" defaultChecked={this.state.filter.enabled} onChange={toggleFilter} /></td>
        <td onClick={select}>{this.state.filter.text}</td>
        <td width="50px;">{this.state.filter.matchCount}</td>
      </tr>
    );
  }
}

export default Filter;