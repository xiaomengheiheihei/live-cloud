import React, { Component } from 'react';
import { Breadcrumb, Icon, Input, Pagination, message } from 'antd';
import { Link } from 'react-router-dom';
import './index.scss'
import ReactHLS from 'react-hls';
import http from '../../../utils/http'

const Search = Input.Search;

class LivePreview extends Component {
    state = {
        currentTab: 1,
        listData: [
            {
                status: 1,
                cover: '',
                url: '',
                origin: 'PGM',
                usePerson: '李雷',
                pushUrl: '',
                playUrl: ''
            }
        ]
    }

    componentDidMount () {
        this.getInfos()
    }

    getInfos (current=1, size=10, projectName='', status='') {
        let params = {
            current: current,
            size: size,
            projectName: projectName,
            status: status
        }
        http.get('/api/projectInfo/list', params)
        .then(res => {
            if (res.code === 200) {
                this.setState({listData: res.data.rows})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }
    changeList = (type) => {            // 改变列表状态
        this.setState({currentTab: type})
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
                        <h3>空军无人机回放列表</h3>
                        <div className="right">
                            <div className="tabs-wrap">
                                <span 
                                    style={{borderTopLeftRadius: 5,borderBottomLeftRadius: 5}} 
                                    onClick={() => this.changeList(1)}
                                    className={this.state.currentTab === 1 ? 
                                    'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>全部</span>
                                <span 
                                    style={{borderRight: 0, borderLeft: 0}} 
                                    onClick={() => this.changeList(2)}
                                    className={this.state.currentTab === 2 ? 
                                    'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>推流中</span>
                                <span 
                                    style={{borderTopRightRadius: 5, borderBottomRightRadius: 5}} 
                                    onClick={() => this.changeList(3)}
                                    className={this.state.currentTab === 3 ? 
                                    'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>未推流</span>
                            </div>
                            <Search
                                placeholder="输入设备名"
                                onSearch={value => console.log(value)}
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>
                    <div className="push-address">
                        <span>直播推流地址：</span>
                        rtmp://pili-publish.banmaim.com/banmaim-zhibo/live688-0-1534496255?key=86c26099c834c754
                    </div>
                    <div className="push-address">
                        <span>RTMP播放地址：</span>
                        rtmp://pili-publish.banmaim.com/banmaim-zhibo/live688-0-1534496255?key=86c26099c834c754
                    </div>
                    <ul className="live-preview-list">
                        {
                            this.state.listData.map((item, i) => (
                                <li className="clear" key={item.id}>
                                    <div className="left-wrap">
                                        {
                                            !item.playUrl ?
                                            <div>
                                                <div className="img-wrap">
                                                    <img alt="" src={item.cover} />
                                                </div>
                                                <div className="play-icon">
                                                    <Icon style={{fontSize: 60}} type="play-circle" />
                                                </div> 
                                            </div>:
                                            <ReactHLS url={item.playUrl} constrols={false}/>
                                        }
                                    </div>
                                    <div className="right-wrap">
                                        <section className="list-item-detail">
                                            <h3>{item.origin}</h3>
                                        </section>
                                        {
                                            item.crtUsrName !== '' &&
                                            <section className="list-item-detail">
                                                <span className="created-person">使用者：{item.crtUsrName}</span>
                                            </section>
                                        }
                                        <div className="address-wrap">
                                            <div className="item-push-address">
                                                <span>直播推流地址：</span>
                                                rtmp://pili-publish.banmaim.com/banmaim-zhibo/live688-0-1534496255?key=86c26099c834c754
                                            </div>
                                            <div className="item-push-address">
                                                <span>RTMP播放地址：</span>
                                                rtmp://pili-publish.banmaim.com/banmaim-zhibo/live688-0-1534496255?key=86c26099c834c754
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