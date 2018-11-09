import {Component} from "react";
import Modal from "react-modal";
import React from "react";

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
    if (this.textInput) {
      let filters = this.state.getFilters();
      filters.push({
        key: guid(),
        text: this.textInput.value,
        class: this.colorSelect.value,
        enabled: true,
        exclude: false,
        selected: false,
        matchCount: this.state.fileData.filter(f => f.text.toLowerCase().match(this.textInput.value.toLowerCase())).length
      });
      localStorage[this.state.fileName] = JSON.stringify(filters);
      this.props.closeModal();
      this.props.filterChanged();
    }
  }

  render() {
    let closeModal = () => this.props.closeModal();

    return (
      <Modal isOpen={this.state.open}
             onRequestClose={closeModal}
             style={addFilterModalStyle}
             contentLabel="Add Filter">
        <form method="post" action="" id="add-filter-form" onSubmit={this.save.bind(this)}>
          <div className="clearfix mbm">
            <div className="pull-left"></div>
            <div className="text-right pull-right">
              Filter Color
              <select id="filter-color-picker"
                      ref={(input) => this.colorSelect = input}>
                <option value="opt-0"></option>
                <option value="opt-1">Blue</option>
                <option value="opt-2">Red</option>
              </select>
            </div>
          </div>

          <div>
            <p>Filter Text <input type="text"
                                  defaultValue={this.state.text}
                                  id={"add-filter-text"}
                                  ref={(input) => this.textInput = input} />
            </p>
            <div className="mtop">
              <button type="submit">Save</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </form>
      </Modal>
    );
  }
}

export default AddFilterModal;