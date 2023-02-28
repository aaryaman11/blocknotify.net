import React, { Component } from "react";
import RegisterModal from "./components/RegisterModal";
import VerifyModal from "./components/VerifyModal";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewVerifier: false,
      verificationList: [],
      errors: [],
      registerModal: false,
      verifyModal: false,
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

  addError = (e) => {
    console.log("e.response.data.errors")
    console.log(e.response.data.errors)
    console.log("this.state.errors")
    console.log(this.state.errors)
    this.setState({ errors: [...this.state.errors, e.response.data.errors] });
  };

  refreshList = () => {
    axios
        .get("http://localhost:8000/api/register")
        .then((res) => this.setState({ verificationList: res.data }))
        .catch((err) => this.addError(err));
  };

  registerToggle = () => {
    this.setState({ registerModal: !this.state.registerModal });
  };

  verifyToggle = () => {
    this.setState({ verifyModal: !this.state.verifyModal });
  };

  handleRegisterSubmit = (item) => {
    this.registerToggle();
    // TODO: replace this with an actual signature of item.phone from a wallet:
    const signature = "0xf5d6863ac0db1b3728ed24c514ab6136b828066812dbca4804fe3fbe4bb515bd6376dc621f75c2b45f98482c234a2a802bd9bd0c44ef03c73cf0217377ffc4a91b"
    item['signature'] = signature;
    // TODO: remove this once we are receiving real signatures, this phone number is for this signature
    const phone = "30305676789";
    // TODO: remove this once we are receiving real signatures, this phone number is for this signature
    item['fake_phone'] = phone;
    // TODO: we don't support editing yet...
    // if (item.id) {
    //   console.log("editing item: %o", item)
    //   axios
    //       .put(`http://localhost:8000/api/register/${item.id}/`, item)
    //       .then((res) => this.refreshList());
    //   return;
    // }
    // console.log("creating item: %o", item)
    axios
        .post("http://localhost:8000/api/register", item)
        .then((res) => {
          console.log("create-response:", res)
          this.refreshList()
        })
        .catch((reason) => {
          console.log("catch-reason:%o", reason)
          console.log("errors:", this.state.errors)
          this.addError(reason)
        });
  };

  handleVerifySubmit = (item) => {
    this.verifyToggle();
    // TODO: replace this with an actual signature of item.challenge from a wallet:
    const signature = "0x6afb3b11522beff5d7ac3ef2460dff154cbec88fe3f2af4850a448f24e425c921980e442ccfd650784fe3e64188701165391c663e0da8933dbe8ae83d632b61c1c"
    item['signature'] = signature;
    // TODO: remove this once we are receiving real signatures, this challenge is for this signature
    const challenge = "123123";
    item['challenge'] = challenge;
    // if (item.id) {
    //   console.log("editing item: %o", item)
    //   axios
    //       .put(`http://localhost:8000/api/register/${item.id}/`, item)
    //       .then((res) => this.refreshList());
    //   return;
    // }
    // console.log("creating item: %o", item)
    axios
        .post("http://localhost:8000/api/verify", item)
        .then((res) => this.refreshList())
        .catch((err) => this.addError(err));
  };

  handleDelete = (item) => {
    axios
        .delete(`/api/register/${item.id}/`)
        .then((res) => this.refreshList())
        .catch((err) => this.addError(err));
  };

  register = () => {
    const item = { phone: "", signature: "" };

    this.setState({ activeItem: item, registerModal: !this.state.registerModal });
  };

  verify = () => {
    const item = { challenge: "", signature: "" };

    this.setState({ activeItem: item, verifyModal: !this.state.registerModal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, registerModal: !this.state.registerModal });
  };

  displayVerifier = (status) => {
    if (status) {
      return this.setState({ viewVerifier: true });
    }

    return this.setState({ viewVerifier: false });
  };

  // renderTabList = () => {
  //   return (
  //       <div className="nav nav-tabs">
  //       <span
  //           onClick={() => this.displayVerifier(true)}
  //           className={this.state.viewVerifier ? "nav-link active" : "nav-link"}
  //       >
  //         Complete
  //       </span>
  //         <span
  //             onClick={() => this.displayVerifier(false)}
  //             className={this.state.viewVerifier ? "nav-link" : "nav-link active"}
  //         >
  //         Incomplete
  //       </span>
  //       </div>
  //   );
  // };

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
                  {/*{this.state.errors}*/}
                  {this.state.errors && this.state.errors.map((error, index) =>
                      <tr key={index}>
                        <td>{error}</td>
                      </tr>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-10 mx-auto p-0">
              <div className="card p-3">
                <div className="mb-4">
                  <button
                      className="btn btn-primary"
                      onClick={this.register}
                  >
                     Phone
                  </button>
                </div>
              </div>
              <div className="card p-3">
                <div className="mb-4">
                  <button
                      className="btn btn-primary"
                      onClick={this.verify}
                  >
                    Verify Phone
                  </button>
                </div>
              </div>
              {/*{this.renderTabList()}*/}
              <div className="card p-3">
                <ul className="list-group list-group-flush border-top-0">
                  {this.renderItems()}
                </ul>
              </div>
            </div>
          </div>
          {this.state.registerModal ? (
              <RegisterModal
                  activeItem={this.state.activeItem}
                  toggle={this.registerToggle}
                  onSave={this.handleRegisterSubmit}
              />
          ) : null}
          {this.state.verifyModal ? (
              <VerifyModal
                  activeItem={this.state.activeItem}
                  toggle={this.verifyToggle}
                  onSave={this.handleVerifySubmit}
              />
          ) : null}
        </main>
    );
  }
}

export default App;
