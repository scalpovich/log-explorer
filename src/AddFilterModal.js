import {Component} from "react";
import Modal from "react-modal";
import React from "react";
import FilterService from "./FilterService";

const addFilterModalStyle = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root');

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

class AddFilterModal extends Component {
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

  save(event) {
    event.preventDefault();
    if (this.textInput.value) {
      let filters = this.state.getFilters();
      let common = {
        text: this.textInput.value,
        class: this.colorSelect.value,
        exclude: this.excludeCheck.checked,
        caseSensitive: this.caseCheck.checked,
        matchCount: this.state.fileData.filter(line =>
          FilterService.matchesFilter(this.caseCheck.checked, line, this.textInput.value)).length
      };
      if (this.state.args.key) {
        let filter = filters.find(f => f.key === this.state.args.key);
        Object.keys(common).forEach(key => filter[key] = common[key]);
      } else {
        // add
        filters.push({
          ...common,
          key: guid(),
          enabled: true,
          selected: false,
        });
      }
      localStorage[this.state.fileName] = JSON.stringify(filters);
      this.props.closeModal();
      this.props.filterChanged();
    }
  }

  afterOpenModal() {
    this.textInput.focus();
    this.textInput.select();

    if (this.state.args.key) {
      let filter = this.getFilter(this.state.args.key);
      if (filter) {
        this.textInput.value = filter.text;
        this.colorSelect.value = filter.class;
        this.excludeCheck.checked = filter.exclude;
        this.caseCheck.checked = filter.caseSensitive;
      }
    }
  }

  getFilter(key) {
    return this.state.getFilters().find(f => f.key === key);
  }

  render() {
    let closeModal = () => this.props.closeModal();

    return (
      <Modal isOpen={this.state.args.open}
             onRequestClose={closeModal}
             onAfterOpen={this.afterOpenModal.bind(this)}
             style={addFilterModalStyle}
             contentLabel="Add Filter">
        <form method="post" action="" id="add-filter-form" onSubmit={this.save.bind(this)}>
          <h3 className={"mtop-5"}>Add Filter</h3>
          <div>
            <p>
              Filter Text&nbsp;
              <input type="text" defaultValue={this.state.args.text} id={"add-filter-text"}
                     ref={(input) => this.textInput = input} />
            </p>
            <div className="clearfix mbm">
              <div className="pull-left">
                <span>
                  Filter Color&nbsp;
                  <select id="filter-color-picker"
                          ref={(input) => this.colorSelect = input}>
                    <option value="no-background">Normal</option>
                    {
                      this.props.filterColors.map((color, i) => {
                        return <option key={i} value={`filter-color-${i}`}>{color.name}</option>
                      })
                    }
                  </select>
                </span>
                <span className={"mleft"}>
                  <label>
                    <input type="checkbox" ref={(input) => this.excludeCheck = input} /> Exclude?
                  </label>
                </span>
                <span className={"mleft"}>
                  <label>
                    <input type="checkbox" ref={(input) => this.caseCheck = input} /> Case sensitive?
                  </label>
                </span>
              </div>
              <div className={"pull-right"}>

              </div>
            </div>
            <div className="mtop">
              <button type="submit" className={"save-filter"}>Save</button>
              <button type="button" className={"close-filter-modal"} onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </form>
      </Modal>
    );
  }
}

export default AddFilterModal;