import React, { Component } from 'react';
import './index.scss'
import { Input } from 'antd';

class Top extends Component {
    state = {
        searchStyle: {
            width: 0,
            border: 0
        }
    }
    showSearch = () => {
        let temp = {
            width: 180,
            border: '1px solid rgb(217, 217, 217)'
        }
        this.setState({searchStyle: temp})
    }
    hideSearch = () => {
        this.setState({searchStyle: {width: 0,border: 0}}) 
    }
    render () {
        return (
            <div className="live-cloud-top clear">
                <div className="live-cloud-top-icon">
                    <span><i className="iconfont live-cloud-elastic"></i></span>
                </div>
                <div className="live-cloud-top-userinfo">
                    <span className="task-wrap">
                        <i className={'iconfont live-cloud-ditu'}></i>指挥调度
                    </span>
                    <span className="top-search">
                        <span><Input size="small" 
                            placeholder="请输入搜索内容" 
                            style={this.state.searchStyle}
                            onBlur={this.hideSearch} /></span>
                        <i onClick={this.showSearch} className={'iconfont live-cloud-sousuo'}></i>
                    </span>
                    <span className="top-message">
                        <i className={'iconfont live-cloud-system-message'}></i>
                    </span>
                    <span className="top-user">
                        <i className={'iconfont live-cloud-zhanweitu1'}></i>
                        <span>modzzy</span>
                    </span>
                </div>
            </div>
        )
    }
}   

export default Top