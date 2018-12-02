import React, { Component } from 'react';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';
import MyLayout from '../views/index';
import Login from '../views/login/index'
import H5Page from '../views/live/H5Page/index'
import Cookies from 'js-cookie';

@withRouter
class Routers extends Component {
    constructor(props) {
        super(props)
        this.pathname = this.props.location.pathname;
    }
    checkLogin = () => {   
        if(this.props.location.pathname !== '/login') {
            if (!Cookies.get('Authorization')) {
                this.props.history.replace('/login');
            }
        } else {
            if (Cookies.get('Authorization')) {
                this.props.history.replace('/deviceManagement/deviceList');
            }
        }
    }
    componentWillMount () {
        if (this.pathname === '/') {
            if (Cookies.get('Authorization')) {
                this.props.history.replace('/deviceManagement/deviceList');
            } else {
                this.props.history.replace('/login');
            }
        } else {
            this.checkLogin();
        }
    }
    componentWillReceiveProps (){
        this.checkLogin()
    }
    render () {
        return (
            <Switch>
                <Route path="/login" component={Login} exact/>
                <Route path="/liveManagement/releaseVideo" component={H5Page} exact/>
                <Route path='/' component={MyLayout}/>
                <Redirect to="/" />
            </Switch>
        )
    }
}

export default Routers
