import React, { Component } from 'react';
import { Pagination, Modal, Upload, Checkbox, DatePicker, Icon,Radio, Input, Button, message } from 'antd';
// import { withRouter, Link } from 'react-router-dom'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import './index.scss'
// import ReactFlowPlayer from "react-flow-player";
import ReactHLS from 'react-hls';
import http from '../../../utils/http'

const Search = Input.Search;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const props = {
    action: '/api/upload',
    headers: {
        // authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
}

class VideoRecording extends Component {

    state = {
        listData: [],
        visible: false,
        value: 1,
        deviceList: [],
        currentItem: {},
        currentTitle: '',
        currentPlayUrl: '',
        listTotal: 0,
        checkArr: ''
    }

    componentDidMount () {
        this.getList()
    }

    getList (current=1, size=12, projectName='', status='2') {
        let params = {
            current: current,
            size: size,
            projectName: projectName,
            status: status
        }
        http.get('/api/projectInfo/list', params)
        .then(res => {
            if (res.code === 200) {
                this.setState({listData: res.data.rows,listTotal: Number(res.data.total)})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }

    changeTime = (date, dateString) => {

    }

    handleOk = (e) => {
        if (this.state.currentTitle === '进入非编') {
            let arr = [];
            for (let i of this.state.deviceList) {      // 设备回放视频
                if (this.state.checkArr.indexOf(i.id) > -1) {
                    let obj = {
                        title: '',
                        url: '',
                        thumbnail: '',
                        type: 'video'
                    }
                    obj.title = i.label;
                    obj.url = i.url;
                    arr.push(obj)
                } 
            }
            let obj = {         // 项目回放视频
                title: this.state.currentItem.projectName,
                url: this.state.currentItem.objKey,
                thumbnail: '',
                type: 'video'
            }
            arr.push(obj);
            let params = {
                username: 'txq',
                projects: arr
            }
            http.post(`/api/mediaOnVideo/importPorject`, params)
            .then(res => {
                window.open(`https://api.onvideo.cn/api/ajax/enter_onvideo/?username=txq&portal_host=https://qiniu.onvideo.cn&sign=1b9ad08f385ae27c5604cd265881a8ce&menu=material`)
            })
            .catch(error => {
                message.error(`网络连接失败，请稍后重试！`);
            })
        }
        this.handleCancel();
    }
    
    handleCancel = (e) => {
        this.setState({
            visible: false,
            currentPlayUrl: '',
            currentItem: null,
            deviceList: [],
            checkArr: []
        });
    }

    selectedDevice = (checkedValues) => {
        this.setState({checkArr: checkedValues})
    }

    openFb = (item) => {
        this.setState({visible: true, currentTitle: '进入非编', currentItem: item})
        let arr = []
        for (let value of item.deviceList) {
            let obj = {
                label: '',
                value: '',
                url: '',
                title: item.projectName,
                id: ''
            }
            obj.label = value.deviceName;
            obj.value = value.id;
            obj.url = value.objKey;
            obj.id = value.id;
            arr.push(obj)
        }
        this.setState((state) => state.deviceList = arr)
    }

    changeReplay = (item) => {
        this.setState({visible: true, currentTitle: '上传录像'})
    }

    playVideo = (item) => {
        this.setState({visible: true, currentTitle: '视频播放', currentPlayUrl: item.objKey})
    }

    pageChange = (page, pageSize) => {
        this.getList(page, pageSize, '', '');
    }

    render () {
        return (
            <div className="video-recording-wrap">
                <div className="item-top-wrap">
                    <h3>录像管理</h3>
                    <div className="item-top-b">
                        <div className="item-top-s">
                            <span>时间：</span><RangePicker 
                            locale={locale} 
                            separator='至'
                            suffixIcon={<Icon type="none" />}
                            placeholder={['开始时间', '结束时间']}
                            onChange={this.changeTime} />
                        </div>
                        <Search
                            placeholder="输入直播名称"
                            onSearch={value => this.getList(1, 12, value, '')}
                            style={{ width: 200 }}
                        />
                    </div>
                </div>
                <div className="video-recording-content">
                    <div className="video-recording-main">
                        <div className="main">
                            <ul className="clear">
                                {
                                    this.state.listData.map((item, i) => (
                                        <li className="item" key={item.id}>
                                            <div className="player">
                                                <span className="bit-tips">1080P</span>
                                                <img src={item.cover} alt="" />
                                                <div className="play-icon">
                                                    <span onClick={() => this.playVideo(item)} className="play-icon-content"></span>
                                                </div>
                                            </div>
                                            <div className="detail">
                                                <p><span>名称：</span>{item.projectName}</p>
                                                <div className="item">
                                                    <span>创建人：<i>{item.crtUsrName}</i></span>
                                                    <span className="time">时间：<i>{item.crtTm}</i></span>
                                                </div>
                                            </div>
                                            <div className="btn-wrap">
                                                {/* <span className="qg">取稿</span>
                                                <span className="ct">拆条</span> */}
                                                <span onClick={() => this.openFb(item)} className="fb">非编</span>
                                                {/* <span onClick={() => this.changeReplay(item)} className="replace">录像替换</span> */}
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <Pagination showSizeChanger showQuickJumper defaultCurrent = {1}
                            total = {this.state.listTotal}
                            defaultPageSize = {12}
                            onChange = {(page, pageSize)=>this.pageChange(page, pageSize)} />
                    </div>
                </div>
                <Modal
                    title={this.state.currentTitle}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="确定"
                    cancelText="取消"
                    getContainer={() => document.querySelector('.video-recording-wrap')}
                    onCancel={this.handleCancel}
                >
                    {
                        this.state.currentTitle === '进入非编' ? 
                        (
                            <div className="modal-wrap">
                                <RadioGroup onChange={this.changeFbRec} value={this.state.value}>
                                    <Radio value={1}>直接进入非编系统</Radio>
                                </RadioGroup>
                                <p>将本次直播设备回放加入素材</p>
                                <CheckboxGroup options={this.state.deviceList} onChange={this.selectedDevice} />
                            </div>
                        ) : this.state.currentTitle === '视频播放' ?
                        (
                            <ReactHLS url={this.state.currentPlayUrl} autoplay={true} constrols={false}/>
                        ) : 
                        (
                            <Upload {...props}>
                                <Button>
                                    <Icon type="upload" />点击上传
                                </Button>
                            </Upload>
                        )
                    }
                </Modal>
            </div>
        )
    }
}


export default VideoRecording