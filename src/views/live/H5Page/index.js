import React, { Component } from 'react';
import { Avatar, Input, Button, message } from 'antd';
import ReactHLS from 'react-hls';
import http from '../../../utils/http'
import { withRouter } from 'react-router-dom'
import './index.scss'

const { TextArea } = Input;


@withRouter
class H5Page extends Component {

    state = {
        commentList: [
            {
                avatar: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-718000.jpg',
                time: '12:23:45',
                name: 'jps',
                content: '啊就很受打击就是都不会分别谁都不能接',
                id: 1
            },
            {
                avatar: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-717996.png',
                time: '12:23:45',
                name: '王大为',
                content: '啊就很受打击就是都不会分别谁都不能接',
                id: 2
            },
            {
                avatar: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-717947.jpg',
                time: '12:23:45',
                name: '利达则',
                content: '啊就很受打击就是都不会分别谁都不能接',
                id: 3
            }
        ],
        projectInfo: {}
    }

    componentDidMount () {
        this.getProjectInfo()
    }

    getProjectInfo () {
        http.get(`/api/projectInfo/detail/${this.props.location.search.split('=')[1]}`)
        .then(res => {
            if (res.code === 200) {
                this.setState({projectInfo: res.data})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error(`网络连接失败，请稍后重试！`)
        })
    }

    render () {
        return (
            <div className="h5-page-wrap">
                <h1>{this.state.projectInfo && this.state.projectInfo.projectName}</h1>
                <span>
                    <i style={{fontSize: 20}} className={'iconfont live-cloud-renshu'}></i>
                    10000
                </span>
                <div className="main clear">
                    <div className="left">
                        <ReactHLS url={"http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8"}/>
                        <div className="user-info-wrap">
                            <div className="top">
                                <span className="title">图文直播</span>
                                <span className="btn">发布直播内容</span>
                            </div>
                            <div className="text-img-wrap clear">
                                <div className="img-wrap">
                                    <Avatar src="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-717995.jpg" />
                                </div>
                                <div className="text-wrap">
                                    <div className="title-time">
                                        <span className="title">一直主播</span>
                                        <span className="time">12:33:22</span>
                                    </div>
                                    <div className="content">
                                        <p>欢迎了来到我的直播间</p>
                                        <img src="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-718229.jpg" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h3>互动直播</h3>
                        {
                            this.state.commentList.map((item, i) => (
                                <section className="item" key={item.id}>
                                    <div className="top clear">
                                        <div className="left">
                                            <Avatar src={item.avatar} />
                                            <span>{item.name}</span>
                                        </div>
                                        <span>{item.time}</span>
                                    </div>
                                    <div className="content">
                                        {item.content}
                                    </div>
                                    <div className="replay"><span>回复</span></div>
                                </section>
                            ))
                        }
                        <TextArea rows={6} />
                        <div className="submit"><Button type="primary">发表</Button></div>
                    </div>
                </div>
            </div>
        )
    }
}


export default H5Page