import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import SignIn from './SignIn';
import UserRegister from './UserRegister';
import AddBook from './AddBook';
import LogOut from './LogOut';
import './App.css';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state={
            user:{
                username: null,
                password: null,
                loggedIn: false,
            },
        };
    }

    loggedInUser =(username, password, loggedIn)=>{
        console.log("Here");
        this.setState({
            username: username,
            password: password,
            loggedIn: loggedIn,
        });
    };
    LogOut=()=>{
      this.setState({
          loggedIn: false,
          username: null,
          password: null,
      });
      fetch('/users/logout')
          .then(ldata=>ldata.text())
          .then(ldata=>console.log(ldata));
    };


    render() {
        return (
            <div>
                <Router>
                    <h1>Home Page</h1>
                    <Link to='/'>Home</Link>
                    <Link to='/login'>Sign-In</Link>
                    <Link to='/signup'>New User</Link>
                    <Link to='/logout'>Log Out</Link>

                    <Route path={"/login"} component={()=><SignIn user={this.state.user} loggedInUser={this.loggedInUser}/>}/>
                    <Route path={"/"} component={()=><AddBook user={this.state.user} loggedInUser={this.loggedInUser}/>}/>
                    <Route path={"/signup"} component={()=><UserRegister/>}/>
                    <Route path={"/logout"} component={()=><LogOut/>}/>
                </Router>
            </div>
        );
    }
}

export default HomePage;