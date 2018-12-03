import React, { Component } from 'react';
// import { Divider } from 'antd';
import logo from '../../../../static/img/logo.png'
import './top.scss';


class SliderTop extends Component {
    render () {
        return (
            <div className="slider-top-wrap">
                <img src={logo} alt="" />
                {/* <Divider style={{height: 25}} type="vertical" /> */}
                <span className="title">直播云管理系统</span>
            </div>
        )
    }
}

export default SliderTop