import React from "react";
import './index.scss'
import { Table, message, Icon } from 'antd';
import {Map, Marker, NavigationControl, MapTypeControl, ScaleControl} from 'react-bmap'
import http from '../../utils/http'
import { subscribeUser } from '../../utils/util';
import * as QNRTC from 'pili-rtc-web';
import Cookies from 'js-cookie';
import Player from '../components/playerRtmp/player'
import { Base64 } from 'js-base64';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// log.setLevel("disable");
class CommandDispatch extends React.Component {

    constructor () {
        super()
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.onTopicMessageReceived = this.onTopicMessageReceived.bind(this);
    }
    
    state = {
        deviceList: [],
        showWait: false,
        todayProject: [
        ],
        columns: [
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '开始时间',
                dataIndex: 'startTime',
                key: 'startTime',
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: text => (<span style={text === 2 ? {color: '#BC1F1F'} : text === 1 ? {color: '#18BE0D'} : {color: '#3D85FF'}}>
                    {text ===  2 ? "已结束" : text === 1 ? "进行中" : "未开始"}
                </span>)
            }
        ],
        listTotal: 0,
        myRTC: null,
        users: [],
        showContextInfo: false,
        centerPosition: {
            lng: '',
            lat: ''
        },
        currentDeviceId: 0,
        currentItem: 0,
        playerOption: {
            autoPlay: "muted",
            preload: "auto",
            width: "140px",
            height: "78px",
            techOrder: ["html5","flash"],
            plugins: {},
            controls: true,
            language: 'zh-CN',
            overNative: true,
            sourceOrder: true,
        },
        nowTime: ''
    }
    token = Cookies.get('Authorization') || '';
    stompClient = null;
    componentDidMount () {
        if (this.token) {
            this.username = JSON.parse(Base64.decode(this.token.split('.')[1])).username;
        }
        this.getActiveNum();
        this.getList();
        document.querySelector('.command-dispathc-wrap').style.height = (document.body.clientHeight - 70) + 'px' ;
        this.ws = new SockJS('https://www.infdes.com/ws?token=' + this.token);
        this.stompClient = Stomp.over(this.ws);
        this.stompClient.connect({}, () => this.onConnected(this), this.onError);
        setInterval(() => {
            this.setState(state => state.nowTime = moment().format('YYYY-MM-DD HH:mm:ss'))
        }, 1000)
    }

    onConnected (_this) {
        _this.stompClient.subscribe('/user/'+ _this.username +'/queue/schedule', _this.onMessageReceived);
        _this.stompClient.subscribe('/topic/schedule', _this.onTopicMessageReceived);
        _this.stompClient.send("/app/getDeviceList", {}, "");
    }

    onMessageReceived (payload) {
        var messages = JSON.parse(payload.body);
        if (messages.messageType === '3') {
            if (messages.deviceInfoList.length > 0) {
                this.setState({deviceList: messages.deviceInfoList})
                this.setState(state => {
                    state.centerPosition.lat = messages.deviceInfoList[0].latitude;
                    state.centerPosition.lng = messages.deviceInfoList[0].longitude;
                    return state.centerPosition;
                })
            }
        } else if (messages.messageType === '1' && messages.message === 'accept' && this.state.myRTC) {
            this.setState({showContextInfo: true});
            this.state.myRTC && this.checkActiveUser(this.state.myRTC, this.state.users);
        } else if (messages.messageType === '1' && messages.message === 'reject' && this.state.myRTC) {
            message.error('对方拒绝了你的视频邀请！');
            this.cancelContext()
        } else if (messages.messageType === '5') {
            message.error('对方已经挂断！');
            this.cancelContext()
        }
    }

    onTopicMessageReceived (payload) {
        this.onMessageReceived(payload)
    }

    sendMessage (chatMessage) {
        this.stompClient.send("/app/scheduleMessage", {}, JSON.stringify(chatMessage));
    }

    onError (error) {
        console.log(error)
    }

    getList (current=1, size=10, projectName='', status='1', todayFlag = '1') {
        let params = {
            current: current,
            size: size,
            projectName: projectName,
            status: status,
            todayFlag: todayFlag
        }
        http.get('/api/projectInfo/list', params)
        .then(res => {
            if (res.code === 200) {
                let arr = [];
                for (let item of res.data.rows) {
                    let temp = {
                        name: '',
                        startTime: '',
                        status: null,
                        playUrl: ''
                    };
                    temp.name = item.projectName;
                    temp.startTime = item.beginTm;
                    temp.status = item.status;
                    temp.playUrl = item.playUrl;
                    arr.push(temp)
                }
                this.setState({todayProject: arr, listTotal: Number(res.data.total)})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
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
        params.append('room', 'room_' + item.deviceId)
        http.post(`/api/webrtc/createRoomToken`, params)
        .then(res => {
            if (res.code === 200) {
                // this.ws && this.ws.send(JSON.stringify({destType:1,dest:item.userId,messageType:2,message:`room_${item.userId}`}));
                this.setState({currentDeviceId: item.deviceId})
                this.stompClient.send("/app/scheduleMessage", {}, JSON.stringify({destType:1,dest:item.deviceId,messageType:2,message:`room_${item.deviceId}`}));
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
                if (res.data.length > 0) {
                    this.setState(state => {
                        state.centerPosition.lat = res.data[0].latitude;
                        state.centerPosition.lng = res.data[0].longitude;
                        return state.centerPosition;
                    })
                }
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error(`网络连接失败，请稍后重试！`)
        })
    }

    cancelContext = () => {
        this.stompClient.send("/app/scheduleMessage", {}, JSON.stringify({destType:1,dest: this.state.currentDeviceId,messageType:5,message:``}));
        this.state.myRTC.leaveRoom();
        this.setState({showWait: false})
    }

    checkedItem = (item, index) => {
        this.setState({currentItem: index});
        this.setState(state => {
            state.centerPosition.lat = item.latitude;
            state.centerPosition.lng = item.longitude;
            return state.centerPosition;
        })
        console.log(this.state.centerPosition)
    }

    render () {
        return (
            <div className="command-dispathc-wrap">
                <div className="device-list-wrap">
                    <div className="xj-wrap">
                        <div className="command-dispathc-left">
                            <div className="live-wrap">
                                <div className="top">
                                    <h3>直播巡检</h3>
                                    <span className="more">全部画面</span>
                                </div>
                                <div className="live-content">
                                    {
                                        this.state.todayProject.map((item, index) => (
                                            index < 4 && 
                                            <div key={item.playUrl + item.name} className="live-item">
                                                {
                                                    item.playUrl && 
                                                    <Player sources={[
                                                        {
                                                            type: "rtmp/mp4",
                                                            src: `${item.status === 1 ? 
                                                                item.playUrl : item.status === 2 ? 
                                                                item.objKey : ''}`
                                                        }
                                                    ]} 
                                                    playerOption={this.state.playerOption} />
                                                }
                                                <p>编号：<span>{index+1}</span></p>
                                                <p>名称：<span>{item.name}</span></p>
                                                <p>时间：<span>{item.startTime.split(' ')[1]}</span></p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="device-list-online">
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
                                    this.state.deviceList.length > 0 && this.state.deviceList.map((item, index) => (
                                        <li onClick={() => this.checkedItem(item, index)} className={this.state.currentItem === index ? "item checked" : "item"} key={item.deviceId}>
                                            <div className="name">
                                                {/* <span className="name-circle">{item.deviceName && item.deviceName.length > 1 ? item.deviceName.slice(0,1) : item.deviceName}</span> */}
                                                <span>{item.deviceName}</span>
                                            </div>
                                            <div className="detail">
                                                <span className="tel">{item.phone}</span>
                                                {
                                                    item.latitude === '' ? 
                                                    <span className="no-talk">设备位置信息无法获取</span> :
                                                    <span className="button" onClick={() => this.showcontext(item)}>联络</span>
                                                }
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                    </div>
                </div>
                {
                    this.state.centerPosition.lat !== '' && <Map style={{height: '100%'}} 
                    center={{lng: this.state.centerPosition.lng, lat: this.state.centerPosition.lat}} 
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
                }
                <div className="this-title-wrap">
                    <div className="title-content">
                        <p className="title">指挥调度</p>
                        <div className="time">
                            <span>时间：</span>
                            <i>{this.state.nowTime}</i>
                        </div>
                    </div>
                </div>
                <div className="today-pro live-wrap">
                    <div className="today-content">
                        <div className="top">
                            <h3>今日项目</h3>
                            <span className="more">全部项目</span>
                        </div>
                        <Table 
                            rowKey={record => record.name + record.startTime} 
                            columns={this.state.columns} 
                            pagination={{showQuickJumper: true,size: "small", pageSize: 3, total: this.state.listTotal}}
                            dataSource={this.state.todayProject} />
                        </div>
                </div>
            </div>
        )
    }
}

export default CommandDispatch