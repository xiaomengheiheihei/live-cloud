import React, { Component } from 'react';
import { Breadcrumb, Pagination, Modal, Checkbox, DatePicker, Icon,Radio, Input } from 'antd';
// import { withRouter, Link } from 'react-router-dom'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import './index.scss'

const Search = Input.Search;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;


class VideoRecording extends Component {

    state = {
        listData: [
            {
                id: 1,
                bit: '1080P',
                url: '',
                cover: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-712858.jpg',
                title: '人面桃花相映红，春风又绿江南岸，明月何时照我还',
                createPer: '李大大',
                time: '2018-12-31'
            },
            {
                id: 2,
                bit: '1080P',
                url: '',
                cover: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-712858.jpg',
                title: '人面桃花相映红，春风又绿江南岸，明月何时照我还',
                createPer: '李大大',
                time: '2018-12-31'
            },
            {
                id: 3,
                bit: '1080P',
                url: '',
                cover: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-712858.jpg',
                title: '人面桃花相映红，春风又绿江南岸，明月何时照我还',
                createPer: '李大大',
                time: '2018-12-31'
            },
            {
                id: 4,
                bit: '1080P',
                url: '',
                cover: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-712858.jpg',
                title: '人面桃花相映红，春风又绿江南岸，明月何时照我还',
                createPer: '李大大',
                time: '2018-12-31'
            },
            {
                id: 5,
                bit: '1080P',
                url: '',
                cover: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-712858.jpg',
                title: '人面桃花相映红，春风又绿江南岸，明月何时照我还',
                createPer: '李大大',
                time: '2018-12-31'
            }
        ],
        visible: false,
        value: 1,
        deviceList: [
            {
                label: '张德广手机',
                value: 1
            },
            {
                label: '无人机',
                value: 2
            },
            {
                label: '执法记录仪',
                value: 3
            },
            {
                label: '录入设备',
                value: 4
            }
        ]
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
        this.setState({visible: true})
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
                                                <span className="bit-tips">{item.bit}</span>
                                                <img src={item.cover} alt="" />
                                                <div className="play-icon">
                                                    <Icon style={{fontSize: 60}} type="play-circle" />
                                                </div>
                                            </div>
                                            <div className="detail">
                                                <p>{item.title}</p>
                                                <div className="item">
                                                    <span>创建者：{item.createPer}</span>
                                                    <span>{item.time}</span>
                                                </div>
                                            </div>
                                            <div className="btn-wrap">
                                                <span className="qg">取稿</span>
                                                <span className="ct">拆条</span>
                                                <span onClick={() => this.openFb(item)} className="fb">非编</span>
                                                <span className="replace">录像替换</span>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <Pagination total={50} showSizeChanger showQuickJumper />
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
                            <Radio value={2}>将本次直播设备回放加入素材</Radio>
                        </RadioGroup>
                        <CheckboxGroup options={this.state.deviceList} defaultValue={[1]} onChange={this.selectedDevice} />
                    </div>
                </Modal>
            </div>
        )
    }
}


export default VideoRecording