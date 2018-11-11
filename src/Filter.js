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

  move(filter, up) {
    let filters = this.props.getFilters();
    let index = filters.findIndex(f => f.key === filter.key);
    filters.splice(up ? index - 1: index + 1, 0,
      filters.splice(index, 1)[0]);
    localStorage[this.state.fileName] = JSON.stringify(filters);
    this.props.filterChanged();
  }

  deleteFilter(filter) {
   this.select(filter);
   this.props.deleteFilter();
  }

  render () {
    let toggleFilter = () => this.toggleFilter(this.state.filter);
    let select = () => this.select(this.state.filter);
    let moveUp = () => this.move(this.state.filter, true);
    let moveDown = () => this.move(this.state.filter, false);
    let deleteFilter = () => this.deleteFilter(this.state.filter);

    return (
      <tr className={'filter ' + this.state.filter.class + (this.state.filter.selected ? ' selected' : ' ')}>
        <td width="30px;">
          <button className={"delete"} onClick={deleteFilter}>X</button>
        </td>
        <td width="50px;">
          <input type="checkbox" defaultChecked={this.state.filter.enabled} onChange={toggleFilter} />
        </td>
        <td width="30px;">
          {
            this.state.filterIndex > 0 &&
            <button className={"move-up"} onClick={moveUp}><i className={"arrow up"}></i></button>
          }
        </td>
        <td width="50px;">
          {
            this.state.filterIndex < this.state.totalFilters - 1 &&
            <button className={"move-down"} onClick={moveDown}><i className={"arrow down"}></i></button>
          }
        </td>
        <td onClick={select}>{this.state.filter.text}</td>
        <td width="50px;">{this.state.filter.matchCount}</td>
      </tr>
    );
  }
}

export default Filter;