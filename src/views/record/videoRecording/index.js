import React, { Component } from 'react';
import { Breadcrumb, Pagination, Modal, Checkbox, DatePicker, Icon,Radio, Input, message } from 'antd';
// import { withRouter, Link } from 'react-router-dom'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import './index.scss'
import http from '../../../utils/http'

const Search = Input.Search;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;


class VideoRecording extends Component {

    state = {
        listData: [],
        visible: false,
        value: 1,
        deviceList: [],
        currentItem: {},
        currentTitle: ''
    }

    componentDidMount () {
        this.getList()
    }

    getList (current=1, size=10, projectName='', status='') {
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

    changeTime = (date, dateString) => {

    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }
    
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    changeFbRec = (e) => {

    }

    selectedDevice = (checkedValues) => {

    }

    openFb = (item) => {
        this.setState({visible: true, currentTitle: '进入非编'})
        let arr = []
        for (let value of item.deviceList) {
            let obj = {
                label: '',
                value: ''
            }
            obj.label = value.deviceName;
            obj.value = value.id
            arr.push(obj)
        }
        this.setState((state) => state.deviceList = arr)
    }

    changeReplay = (item) => {
        // this.setState({visible: true, currentTitle: '上传录像'})
    }

    render () {
        return (
            <div className="video-recording-wrap">
                <Breadcrumb className="my-breadcrumb">
                    <Breadcrumb.Item>直播管理</Breadcrumb.Item>
                    <Breadcrumb.Item>录像管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className="video-recording-content">
                    <div className="video-recording-main">
                        <div className="top">
                            <RangePicker 
                                locale={locale} 
                                suffixIcon={<Icon type="search" />}
                                placeholder={['开始时间', '结束时间']}
                                onChange={this.changeTime} />
                            <Search
                                placeholder="输入直播名称"
                                onSearch={value => console.log(value)}
                                style={{ width: 200 }}
                            />
                        </div>
                        <div className="main">
                            <ul className="clear">
                                {
                                    this.state.listData.map((item, i) => (
                                        <li className="item" key={item.id}>
                                            <div className="player">
                                                <span className="bit-tips">1080P</span>
                                                <img src={item.cover} alt="" />
                                                <div className="play-icon">
                                                    <Icon style={{fontSize: 60}} type="play-circle" />
                                                </div>
                                            </div>
                                            <div className="detail">
                                                <p>{item.title}</p>
                                                <div className="item">
                                                    <span>创建者：{item.crtUsrName}</span>
                                                    <span>{item.crtTm}</span>
                                                </div>
                                            </div>
                                            <div className="btn-wrap">
                                                <span className="qg">取稿</span>
                                                <span className="ct">拆条</span>
                                                <span onClick={() => this.openFb(item)} className="fb">非编</span>
                                                <span onClick={() => this.changeReplay(item)} className="replace">录像替换</span>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <Pagination total={1} showSizeChanger showQuickJumper />
                    </div>
                </div>
                <Modal
                    title="进入非编"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="确定"
                    cancelText="取消"
                    getContainer={() => document.querySelector('.video-recording-wrap')}
                    onCancel={this.handleCancel}
                >
                    <div className="modal-wrap">
                        <RadioGroup onChange={this.changeFbRec} value={this.state.value}>
                            <Radio value={1}>直接进入非编系统</Radio>
                        </RadioGroup>
                        <p>将本次直播设备回放加入素材</p>
                        <CheckboxGroup options={this.state.deviceList} onChange={this.selectedDevice} />
                    </div>
                </Modal>
            </div>
        )
    }
}


export default VideoRecording