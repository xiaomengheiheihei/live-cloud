import React, { Component } from 'react';
import { Breadcrumb, Icon, Input, Pagination, message } from 'antd';
import { Link } from 'react-router-dom';
import './index.scss'
import { withRouter } from 'react-router-dom'
import Player from '../../components/playerRtmp/player'
// import ReactFlowPlayer from "react-flow-player";
import http from '../../../utils/http'

const Search = Input.Search;

@withRouter
class LivePreview extends Component {
    state = {
        currentTab: '',
        listData: [],
        projectInfo: null,
        playerOption: {
            autoPlay: "muted",
            preload: "auto",
            width: "280px",
            height: "150px",
            techOrder: ["html5","flash"],
            plugins: {},
            controls: true,
            language: 'zh-CN',
            overNative: true,
            sourceOrder: true,
        },
        // sources: {
        //         type: "rtmp/mp4",
        //         src: 'rtmp://pili-publish.tt.test.cloudvdn.com/test-demo01/1084787021836214273@wmt_abckey94'
        // }
    }

    componentDidMount () {
        this.getInfos(1, 10, this.props.location.search.split('=')[1], '', '')
        this.getProjectInfo()
    }

    getInfos (current=1, size=10, projectId='', status='', deviceName = '') {
        let params = {
            current: current,
            size: size,
            projectId: projectId,
            streamingStatus: status,
            deviceName: deviceName
        }
        http.get('/api/projectInfo/streamList', params)
        .then(res => {
            if (res.code === 200) {
                this.setState({listData: res.data})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
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
    changeList = (type) => {            // 改变列表状态
        this.setState({currentTab: type})
        this.getInfos(1, 10, this.props.location.search.split('=')[1], type, '')
    }
    render () {
        return (
            <div className="live-preview-wrap">
                <Breadcrumb className="my-breadcrumb">
                    <Breadcrumb.Item>直播管理</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/liveManagement/liveList">直播列表</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>直播预览</Breadcrumb.Item>
                </Breadcrumb>
                <div className="live-preview-content">
                    <div className="live-preview-top clear">
                        <h3>{this.state.projectInfo && this.state.projectInfo.projectName}</h3>
                        <div className="right">
                            <div className="tabs-wrap">
                                <span 
                                    style={{borderTopLeftRadius: 5,borderBottomLeftRadius: 5}} 
                                    onClick={() => this.changeList('')}
                                    className={this.state.currentTab === '' ? 
                                    'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>全部</span>
                                <span 
                                    style={{borderRight: 0, borderLeft: 0}} 
                                    onClick={() => this.changeList(1)}
                                    className={this.state.currentTab === 1 ? 
                                    'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>推流中</span>
                                <span 
                                    style={{borderTopRightRadius: 5, borderBottomRightRadius: 5}} 
                                    onClick={() => this.changeList(0)}
                                    className={this.state.currentTab === 0 ? 
                                    'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>未推流</span>
                            </div>
                            <Search
                                placeholder="输入设备名"
                                onSearch={value => this.getInfos(1, 10, this.props.location.search.split('=')[1], '', value)}
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>
                    <div className="push-address">
                        <span>直播推流地址：</span>
                        {this.state.projectInfo && this.state.projectInfo.pushUrl}
                    </div>
                    <div className="push-address">
                        <span>RTMP播放地址：</span>
                        {this.state.projectInfo && this.state.projectInfo.playUrl}
                    </div>
                    <ul className="live-preview-list">
                        {
                            this.state.listData.map((item, i) => (
                                <li className="clear" key={item.name + item.pushUrl}>
                                    <div className="left-wrap">
                                        {
                                            item.playUrl === '' || item.streamingStatus === 0 ?
                                            <div>
                                                <div className="img-wrap">
                                                    <img alt="" src={item.cover} />
                                                </div>
                                                <div className="play-icon">
                                                    <Icon style={{fontSize: 60}} type="play-circle" />
                                                </div> 
                                            </div>:
                                            <Player sources={[
                                                        {
                                                            type: "rtmp/mp4",
                                                            src: `${item.playUrl}`
                                                        }
                                                    ]} 
                                                    playerOption={this.state.playerOption}>
                                            </Player>
                                        }
                                    </div>
                                    <div className="right-wrap">
                                        <section className="list-item-detail">
                                            <h3>{item.name}</h3>
                                        </section>
                                        {
                                            item.crtUsrName !== '' &&
                                            <section className="list-item-detail">
                                                <span className="created-person">使用者：{item.userName}</span>
                                            </section>
                                        }
                                        <div className="address-wrap">
                                            <div className="item-push-address">
                                                <span>直播推流地址：</span>
                                                {item.pushUrl}
                                            </div>
                                            <div className="item-push-address">
                                                <span>RTMP播放地址：</span>
                                                {item.playUrl}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                        <Pagination total={1} showSizeChanger showQuickJumper />
                    </ul>
                </div>
            </div>
        )
    }
}

export default LivePreview