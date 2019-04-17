import React, { Component } from 'react';

import './App.css';

class UserRegister extends Component {
    constructor(props) {
        super(props);
        this.state={
            msg: "",
        };
    }

    submitNewUserForm=(e)=>{
      e.preventDefault();
      fetch('/users/', {
          method: 'POST',
          headers:{
              "Accept": "application/json",
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
             username: e.target.username.value,
             password: e.target.password.value,
          }),
      })
          .then(nuData=>nuData.text())
          .then(response=>this.setState({msg: response}))
    };

    render() {
        return (
            <div>
                <h1>Add New User</h1>
                <form onSubmit={this.submitNewUserForm}>
                    <p>
                        <label htmlFor={"username"}>Username:</label>
                        <input id={"username"} type="text" name="username" placeholder="Enter Username" autoFocus/>
                    </p>
                    <p>
                        <label htmlFor={"password"}>Password:</label>
                        <input id={"password"} type="text" name="password" placeholder="Enter Password" />
                    </p>
                    <button>Sign Up</button>
                </form>
                {this.state.msg}
            </div>
        );
    }
}

export default UserRegister;