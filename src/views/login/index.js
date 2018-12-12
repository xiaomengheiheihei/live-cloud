import React, { Component } from 'react'
import http from '../../utils/http'
import {withRouter} from 'react-router-dom'
import { message } from 'antd'
import loginStyle from './login.module.scss'
import { Base64 } from 'js-base64';

class Login extends Component {
    constructor (props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        }
    }
    login = () => {
        let req = new FormData();
        req.append('username', this.state.username);
        req.append('password', this.state.password);
        http.post('/api/auth', req)
        .then(res => {
            if (res.code === 200) {
                let userInfo = JSON.parse(Base64.decode(res.data.token.split('.')[1]));
                let obj = {
                    name: userInfo.username, 
                    id: userInfo.sub
                }
                localStorage.setItem('userInfo',JSON.stringify(obj));
                // this.props.ROOT_ChangeUser({
                //     name: userInfo.username, 
                //     id: userInfo.sub
                // })
                message.success('登陆成功！');
                this.props.history.push('/index');
            } else {
                message.error(res.message); 
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！');
        })
    }
    componentDidMount () {
        // console.log(this.props)
    }
    inputChange = (event) => {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        })
    }
    render () {
        const iconStyle = {
            'fontSize': '26px',
            'color': '#fff'
        };
        return (
            <div className={loginStyle.login}>
                <div className={loginStyle.loginBg}>
                    <div style={{width: 60, paddingLeft: 60}}></div>
                    <div className={loginStyle.wrap}>
                        <div className={loginStyle.top}>
                            {/* <img src={logo} alt="" className={loginStyle.logo} /> */}
                            <p className={loginStyle.title}>七牛云</p>
                        </div>
                        <div className={loginStyle.content}>
                            <label className={loginStyle.usernameLabel} htmlFor="username">
                                <i className="iconfont ybk-ser-xingmingyonghumingnicheng" style={iconStyle}></i>
                            </label>
                            <input 
                                type="text" 
                                value={this.state.username}
                                className={loginStyle.myinput} 
                                id="username" 
                                name="username"
                                onChange={this.inputChange}
                                placeholder="用户名"/>
                            <div className={loginStyle.passwordWrap}>
                                <label className={loginStyle.usernameLabel} htmlFor="password">
                                    <i className="iconfont ybk-ser-password" style={iconStyle}></i>
                                </label>
                                <input 
                                    type="password" 
                                    value={this.state.password} 
                                    className={loginStyle.myinput} 
                                    id="password" 
                                    name="password"
                                    onChange={this.inputChange}
                                    placeholder="密  码"/>
                            </div>
                        </div>
                        <button className={loginStyle.loginBtn} onClick={this.login}>登陆</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Login)