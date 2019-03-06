import React, { Component } from 'react';
import './index.scss'
import { inject, observer } from 'mobx-react';
// import { Link } from 'react-router-dom';
import { Input } from 'antd';
import Cookies from 'js-cookie';
import { Base64 } from 'js-base64';

@inject("Root_store") @observer
class Top extends Component {
    state = {
        searchStyle: {
            width: 124,
            border: 'none',
            background: '#F6F6F6',
            borderRadius: '18.5px'
        }
    }
    token = Cookies.get('Authorization') || '';
    username = JSON.parse(Base64.decode(this.token.split('.')[1])).username;

    componentDidMount () {
        // console.log(this.props.Root_store)
    }

    changeMenu = () => {
        if (!this.props.Root_store.collapsed) {
            document.querySelector('.slider-top-wrap .title').style.display = 'none';
            document.querySelector('.slider-top-wrap img').style.marginTop = '-30px';
        } else {
            document.querySelector('.slider-top-wrap .title').style.display = 'block';
            document.querySelector('.slider-top-wrap img').style.marginTop = '20px';
        }
        this.props.Root_store.changeMenu(!this.props.Root_store.collapsed)
    }
    render () {
        return (
            <div className="live-cloud-top clear">
                <div className="live-cloud-top-icon">
                    <span><i onClick={this.changeMenu} className="iconfont live-cloud-elastic"></i></span>
                </div>
                <div className="live-cloud-top-userinfo">
                    <span className="top-search">
                        <span><Input size="small" 
                            placeholder="请输入搜索内容" 
                            style={this.state.searchStyle}/></span>
                        <i className={'iconfont live-cloud-sousuo'}></i>
                    </span>
                    <span className="top-message">
                        <i className={'iconfont live-cloud-icon-p_xinfeng'}></i>
                        <span></span>
                    </span>
                    <span className="top-user">
                        <span>{this.username}</span>
                        <i className={'iconfont live-cloud-zhanweitu1'}></i>
                    </span>
                    <span className="out-btn">
                        <i className={'iconfont live-cloud-tuichudenglu'}></i>
                    </span>
                </div>
            </div>
        )
    }
}   

export default Top