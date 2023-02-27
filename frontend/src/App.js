import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewVerifier: false,
      verificationList: [],
      modal: false,
      activeItem: {
        phone: "",
        signature: "",
        completed: false,
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
        .get("http://localhost:8000/api/register")
        .then((res) => this.setState({ verificationList: res.data }))
        .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();
    // TODO: replace this with an actual signature of item.phone from a wallet:
    const signature = "0xf5d6863ac0db1b3728ed24c514ab6136b828066812dbca4804fe3fbe4bb515bd6376dc621f75c2b45f98482c234a2a802bd9bd0c44ef03c73cf0217377ffc4a91b"
    item['signature'] = signature;
    // TODO: remove this once we are receiving real signatures
    const phone = "30305676789";
    item['phone'] = phone;
    if (item.id) {
      console.log("editing item: %o", item)
      axios
          .put(`http://localhost:8000/api/register/${item.id}/`, item)
          .then((res) => this.refreshList());
      return;
    }
    console.log("creating item: %o", item)
    axios
        .post("http://localhost:8000/api/register", item)
        .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
        .delete(`/api/register/${item.id}/`)
        .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { phone: "", signature: "" };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayVerifier = (status) => {
    if (status) {
      return this.setState({ viewVerifier: true });
    }

    return this.setState({ viewVerifier: false });
  };

  renderTabList = () => {
    return (
        <div className="nav nav-tabs">
        <span
            onClick={() => this.displayVerifier(true)}
            className={this.state.viewVerifier ? "nav-link active" : "nav-link"}
        >
          Complete
        </span>
          <span
              onClick={() => this.displayVerifier(false)}
              className={this.state.viewVerifier ? "nav-link" : "nav-link active"}
          >
          Incomplete
        </span>
        </div>
    );
  };

  renderItems = () => {
    const { viewVerifier } = this.state;
    const newItems = this.state.verificationList
    // const newItems = this.state.verificationList.filter(
    //     (item) => item.completed === viewVerifier
    // );

    return newItems.map((item) => (
        <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center"
        >
        <span
            className={`verification-title mr-2 ${
                this.state.viewVerifier ? "completed-verification" : ""
            }`}
            title={item.challenge}
        >
          {item.phone}
        </span>
          <span>
          <button
              className="btn btn-secondary mr-2"
              onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
              className="btn btn-danger"
              onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
        </li>
    ));
  };

  render() {
    return (
        <main className="container">
          <h1 className="text-white text-uppercase text-center my-4">Phone Verifications</h1>
          <div className="row">
            <div className="col-md-6 col-sm-10 mx-auto p-0">
              <div className="card p-3">
                <div className="mb-4">
                  <button
                      className="btn btn-primary"
                      onClick={this.createItem}
                  >
                    Add Phone Number
                  </button>
                </div>
                {this.renderTabList()}
                <ul className="list-group list-group-flush border-top-0">
                  {this.renderItems()}
                </ul>
              </div>
            </div>
          </div>
          {this.state.modal ? (
              <Modal
                  activeItem={this.state.activeItem}
                  toggle={this.toggle}
                  onSave={this.handleSubmit}
              />
          ) : null}
        </main>
    );
  }
}

export default App;
