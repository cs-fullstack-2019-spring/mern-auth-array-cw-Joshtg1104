import React, { Component } from 'react';

import './App.css';

class SignIn extends Component {
    submitSignIn=(e)=>{
        e.preventDefault();
        fetch('/users/login',
            {
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
            .then(bdata=>bdata.json())
            .then(userBooks=>{console.log(userBooks);
                if(userBooks.username)
                    return this.props.loggedInUser(userBooks.username, userBooks.email, true);
                else
                    return this.props.loggedInUser(null, null, false)});
    };

    render() {
        if(this.props.loggedIn){
            return(
                <div>
                    <h1>{this.props.username}'s Favorite books</h1>
                </div>
            )
        }
        else{
            return (
                <div>
                    <h1>Sign-In</h1>
                    <form onSubmit={this.submitSignIn}>
                        <p>
                            <label htmlFor={"username"}>Username:</label>
                            <input id={"username"} type="text" name="username" placeholder="Username" autoFocus/>
                        </p>
                        <p>
                            <label htmlFor={"password"}>Password:</label>
                            <input id={"password"} type="text" name="password" placeholder="Password" />
                        </p>
                        <button>Log In</button>
                    </form>
                </div>
            );
        }

    }
}

export default SignIn;