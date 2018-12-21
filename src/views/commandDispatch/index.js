import React from "react";
import './index.scss'
import { Table, message, Icon } from 'antd';
import {Map, Marker, NavigationControl, MapTypeControl, ScaleControl} from 'react-bmap'
import http from '../../utils/http'
import { subscribeUser } from '../../utils/util';
import * as QNRTC from 'pili-rtc-web';
import Cookies from 'js-cookie';
import { log } from 'pili-rtc-web';
import { Base64 } from 'js-base64';

// log.setLevel("disable");
class CommandDispatch extends React.Component {
    
    state = {
        deviceList: [],
        showWait: false,
        todayProject: [
            {
                name: '肌肉型男 他们不是健身教练 他们是人民的守护者',
                startTime: '12:22:33',
                status: 0
            },
            {
                name: '肌肉型男 他们不是健身教练 他们是人民的守护者2',
                startTime: '12:22:33',
                status: 0
            },
            {
                name: '肌肉型男 他们不是健身教练 他们是人民的守护者222',
                startTime: '12:22:33',
                status: 0
            }
        ],
        columns: [
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
                width: '200px'
            },
            {
                title: '开始时间',
                dataIndex: 'startTime',
                key: 'startTime',
            },
            {
                title: '状态',
                dataIndex: '',
                key: 'status',
                render: text => (<span>
                    {text === 0 ? "已结束" : text === 1 ? "进行中" : "未开始"}
                </span>)
            }
        ],
        myRTC: null,
        users: [],
        showContextInfo: false,
    }
    token = Cookies.get('Authorization') || '';
    userid = JSON.parse(Base64.decode(this.token.split('.')[1])).sub;
    ws = new WebSocket(`wss://115.231.110.17:9326?name=${this.userid}`)
    componentDidMount () {
        this.getActiveNum()
        document.querySelector('.command-dispathc-wrap').style.height = (document.body.clientHeight - 70) + 'px' 
        // 打开WebSocket连接后立刻发送一条消息:
        this.ws.addEventListener('open', (event) => {
            this.ws.send('Hello Server!');
        })

        this.ws.addEventListener('message', (message) => {
            JSON.parse(message.data).deviceInfoList && this.setState({deviceList: JSON.parse(message.data).deviceInfoList})
            if (JSON.parse(message.data).message === 'accept' && this.state.myRTC) {
                this.setState({showContextInfo: true})
            }
            this.state.myRTC && this.checkActiveUser(this.state.myRTC, this.state.users);
        })

        this.ws.addEventListener('close', (event) => {
            console.log("WebSocket is closed now.");
        })

        this.ws.addEventListener('error', (event) => {
            console.error("WebSocket error observed:", event);
        })
    }

    checkActiveUser (myRTC, users) {
        // 监听房间里的用户发布事件，一旦有用户发布，就订阅他
        myRTC.on('user-publish', user => {
            subscribeUser(myRTC, user);
        });
        // 判断房间当前的用户是否有可以订阅的
        for (let i = 0; i < users.length; i += 1) {
            const user = users[i];
            // 如果当前房间的用户不是自己并且已经发布
            // 那就订阅他
            if (user.published && user.userId !== myRTC.userId) {
                subscribeUser(myRTC, user);
            }
        }
    }

    showcontext (item) {
        this.setState({showWait: true, currentDevice: item});
        let params = new FormData();
        params.append('account', 'user_' + item.userId);
        params.append('room', 'room_' + item.userId)
        http.post(`/api/webrtc/createRoomToken`, params)
        .then(res => {
            if (res.code === 200) {
                this.ws && this.ws.send(JSON.stringify({destType:1,dest:item.userId,messageType:2,message:`room_${item.userId}`}));
                (async () => {
                    const myRTC = new QNRTC.QNRTCSession()
                    this.setState({myRTC: myRTC})
                    try {
                        // 调用 SDK 加入房间
                        const users = await this.state.myRTC.joinRoomWithToken(res.data);
                        this.setState({users: users})
                        this.checkActiveUser(this.state.myRTC, users);
                        // 采集本地媒体流，视频和音频都采集
                        const localStream = await QNRTC.deviceManager.getLocalStream({
                            video: { enabled: true, width: 640, height: 480, bitrate: 600 },
                            audio: { enabled: true, bitrate: 32 },
                        });
                        // 获取我们 room.html 中准备用来显示本地媒体流的元素
                        const localPlayer = document.getElementById('localplayer');
                        // 调用媒体流的 play 方法，在我们指定的元素上播放媒体流，其中第二个参数代表 静音播放
                        localStream.play(localPlayer, true);
                        // 发布刚刚采集到的媒体流到房间
                        await this.state.myRTC.publish(localStream);
                    } catch (e) {
                        console.log('error!', e);
                    }
                })();
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error(`网络连接失败，请稍后重试！`)
        })
    }

    getActiveNum () {
        // let params = new FormData();
        http.post(`/api/webrtc/listActiveDevice`, {})
        .then(res => {
            if (res.code === 200) {
                this.setState({deviceList: res.data})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error(`网络连接失败，请稍后重试！`)
        })
    }

    cancelContext = () => {
        this.state.myRTC.leaveRoom();
        this.setState({showWait: false})
    }

    render () {
        return (
            <div className="command-dispathc-wrap">
                <div className="device-list-wrap">
                    {
                        !this.state.showWait && <h2>在线设备</h2>
                    }
                    {
                        this.state.showWait ? 
                        <div className="context-wrap">
                            <h3>{this.state.currentDevice && this.state.currentDevice.deviceName}</h3>
                            <div className="player-area">
                                <div id="localplayer" className="player"></div>
                                <div className="player1" id="remoteplayer"></div>
                            </div>
                            <p>{this.state.showContextInfo ? `正在通话中...` : '正在等待对方接受邀请...'}</p>
                            <div className="btn-wrap">
                                <span onClick={this.cancelContext}><Icon className="phone-icon" type="phone" /></span>
                                <p onClick={this.cancelContext}>取消</p>
                            </div>
                        </div> :
                        <ul className="deviceList">
                            {
                                this.state.deviceList.length > 0 && this.state.deviceList.map(item => (
                                    <li className="item" key={item.deviceId}>
                                        <div className="name">
                                            <span className="name-circle">{item.deviceName && item.deviceName.length > 1 ? item.deviceName.slice(0,1) : item.deviceName}</span>
                                            <span>{item.deviceName}</span>
                                        </div>
                                        <div className="detail">
                                            <span className="tel">{item.phone}</span>
                                            {
                                                item.latitude === '' ? 
                                                <span className="no-talk">设备位置信息无法获取</span> :
                                                <span className="button" onClick={() => this.showcontext(item)}><i className={'iconfont live-cloud-gaode'}></i>视频通信</span>
                                            }
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    }
                </div>
                <Map style={{height: '100%'}} 
                center={this.state.deviceList.length > 0 && {lng: this.state.deviceList[0].longitude, lat: this.state.deviceList[0].latitude}} 
                // center = {{lng:116.404, lat: 39.915}}
                zoom="10">
                    {
                        this.state.deviceList.length > 0 &&
                        this.state.deviceList.map((item) => (
                            <Marker key={item.deviceId} title={item.deviceName} position={{lng: item.longitude, lat: item.latitude }}>
                                <div className="account-loca">{item.deviceName}<span></span></div>
                            </Marker>
                        ))
                    }
                    <NavigationControl/>
                    <MapTypeControl />
                    <ScaleControl />
                </Map>
                <div className="command-dispathc-left">
                    <div className="live-wrap">
                        <div className="top">
                            <h3>直播巡检</h3>
                            <span className="more">全部画面</span>
                        </div>
                        <div className="live-content">

                        </div>
                    </div>
                    <div className="today-pro live-wrap">
                        <div className="top">
                            <h3>今日项目</h3>
                            <span className="more">全部项目</span>
                        </div>
                        <Table 
                            rowKey={record => record.name + record.startTime} 
                            columns={this.state.columns} 
                            pagination={{showQuickJumper: true,size: "small", total: 20}}
                            dataSource={this.state.todayProject} />
                    </div>
                </div>
            </div>
        )
    }
}

export default CommandDispatch