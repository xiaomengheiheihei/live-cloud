import React, { Component } from 'react';
import { Breadcrumb, Button, Input, Modal, Select, DatePicker, Icon, Upload, message, Pagination } from 'antd';
import { withRouter, Link } from 'react-router-dom'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import './index.scss'
import moment from 'moment';
import ReactHLS from 'react-hls';
import http from '../../../utils/http'

const Search = Input.Search;
const Option = Select.Option;
const { RangePicker } = DatePicker;


@withRouter
class LiveList extends Component {
    state = {
        currentTab: '',
        listData: [],
        visible: false,
        modalTitle: '',
        loading: false,
        deviceList: [],
        rangeTimeVlue: '',
        currentItem: {},
        addLive: {
            projectName: '',
            endTm: '',
            beginTm: '',
            cover: '',
            deviceIdList: [],
            describe: '',
            location: ''
        }
    }

    componentDidMount () {
        this.getList()
        this.getDeviceList()
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
                for (let item of res.data.rows) {
                    item.palyStatus = false
                }
                this.setState({listData: res.data.rows})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }
    getDeviceList () {
        let params = {
            current: 1,
            size: 100000,
            name: '',
            status: ''
        }
        http.get('/api/deviceInfo/list', params)
        .then(res => {
            if (res.code === 200) {
                let arr = [];
                for (let item of res.data.rows) {
                    arr.push(<Option key={item.id}>{item.deviceName}</Option>)
                }
                this.setState({deviceList: arr})
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
        let status = '';
        switch (type) {
            case 0:
                status = 0
                break;
            case 1:
                status = 1
                break;
            case 2:
                status = 2
                break;
            default:
                break;
        } 
        this.getList(1, 10, "",status);
    }

    createLive = () => {            // 新建直播
        this.setState({
            visible: true,
            modalTitle: '新建直播'
        });
    }
    changeLive = (item) => {
        this.setState({
            visible: true,
            modalTitle: '修改直播',
            currentItem: item
        });
        this.setState((state) => {
            let obj = {
                describe: item.describe,
                location: item.location,
                projectName: item.projectName,
                deviceIdList: item.deviceIdList,
                endTm: item.endTm,
                beginTm: item.beginTm,
                cover: item.cover,
            }
            return state.addLive = obj
        })
        this.setState({imageUrl: item.cover})
        this.setState({rangeTimeVlue: [moment(item.beginTm), moment(item.endTm)]})
    }
    pushSteam = (item) => {
        this.setState({
            visible: true,
            modalTitle: '转推流',
            currentItem: item
        });
    }
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));
            this.setState(state => state.addLive.cover = info.file.response.data)
        }
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            imageUrl: '',
            rangeTimeVlue: ''
        });
        this.setState(state => state.addLive = {
            projectName: '',
            endTm: '',
            beginTm: '',
            cover: '',
            deviceIdList: [],
            describe: '',
            location: ''
        })
    }
    handleOk = (e) => {
        if (this.state.modalTitle === '新建直播') {
            http.post('/api/projectInfo/add', this.state.addLive)
            .then(res => {
                if (res.code === 200) {
                    message.success('添加成功！')
                    this.getList()
                } else {
                    message.error(res.message)
                }
                this.handleCancel()
            })
            .catch(error => {
                this.handleCancel()
                message.error(`网络连接失败，请稍后重试！`)
            })
        } else if (this.state.modalTitle === '修改直播') {
            let obj = { ...this.state.addLive }
            obj.id = this.state.currentItem.id
            http.post('/api/projectInfo/update', obj)
            .then(res => {
                if (res.code === 200) {
                    message.success('修改成功！')
                    this.getList()
                } else {
                    message.error(res.message)
                }
                this.handleCancel()
            })
            .catch(error => {
                this.handleCancel()
                message.error(`网络连接失败，请稍后重试！`)
            })
        }
    }
    changeTime = (date, dateString) => {
        this.setState({rangeTimeVlue: date})
        this.setState(state => state.addLive.beginTm = dateString[0] + ':00')
        this.setState(state => state.addLive.endTm = dateString[1] + ':00')
    }

    addLiveName = (e) => {
        const value = e.target.value;
        this.setState((state => state.addLive.projectName = value))
    }

    addLiveAddress = (e) => {
        const value = e.target.value;
        this.setState((state => state.addLive.location = value))
    } 
    addLiveDes = (e) => {
        const value = e.target.value;
        this.setState((state => state.addLive.describe = value))
    } 

    createBk = (item) => {
        let params = new FormData()
        params.append('projectInfoId', item.id)
        http.post(`/api/ybk/createInstance`, params)
        .then(res => {
            if (res.code === 200) {
                let a = document.createElement('a');
                let attr = document.createAttribute("href");
                let attr1 = document.createAttribute("target");
                attr.value = 'http://bmn9g116if8h.kegate-xq.cloudappl.com?ybkInstanceId=' + res.data.ybkInstanceId +
                '&token=' + res.data.token;
                attr1.value = '_blank'
                a.setAttributeNode(attr)
                a.setAttributeNode(attr1)
                document.body.appendChild(a)
                a.click()
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error(`网络连接失败，请稍后重试！`)
        })
    }
    selectDevice = (value) => {
        this.setState((state => state.addLive.deviceIdList = value))
    }

    searchList = (value) => {
        this.getList(1, 10, value,this.state.currentTab);
    }

    playVideo = (item) => {
        if (item.status === 0) { return false }
        this.setState((state) => {
            for (let value of state.listData) {
                if (item.id === value.id) {
                    value.palyStatus = !value.palyStatus
                }
            }
            return state.listData
        })
    }
    render () {
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">上传封面</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <div className="live-list-wrap">
                <Breadcrumb className="my-breadcrumb">
                    <Breadcrumb.Item>直播管理</Breadcrumb.Item>
                    <Breadcrumb.Item>直播列表</Breadcrumb.Item>
                </Breadcrumb>
                <div className="live-list-content">
                    <Button type="primary" onClick={this.createLive} style={{margin: '20px 0'}}>新建直播</Button>
                    <section className="live-list-list-wrap">
                        <div className="top clear">
                            <h3 className="list-title">直播列表</h3>
                            <div className="right">
                                <div className="tabs-wrap">
                                    <span 
                                        style={{borderTopLeftRadius: 5,borderBottomLeftRadius: 5}} 
                                        onClick={() => this.changeList('')}
                                        className={this.state.currentTab === '' ? 
                                        'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>全部</span>
                                    <span 
                                        style={{ borderLeft: 0}} 
                                        onClick={() => this.changeList(1)}
                                        className={this.state.currentTab === 1 ? 
                                        'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>进行中</span>
                                    <span 
                                        style={{borderRight: 0, borderLeft: 0}} 
                                        onClick={() => this.changeList(0)}
                                        className={this.state.currentTab === 0 ? 
                                        'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>未开始</span>
                                    <span 
                                        style={{borderTopRightRadius: 5, borderBottomRightRadius: 5}} 
                                        onClick={() => this.changeList(2)}
                                        className={this.state.currentTab === 2 ? 
                                        'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>已结束</span>
                                </div>
                                <Search
                                    placeholder="输入设备名"
                                    onSearch={this.searchList}
                                    style={{ width: 200 }}
                                />
                            </div>
                        </div>
                        <ul className="list-content">
                            {
                                this.state.listData.length > 0 ? 
                                this.state.listData.map((item, i) => (
                                    <li className="clear" key={item.id}>
                                        <div className="left-wrap">
                                            {   
                                                !item.palyStatus && 
                                                <div>
                                                    <div className="img-wrap">
                                                        <img alt="" src={item.cover} />
                                                    </div>
                                                    <div className="play-icon">
                                                        <Icon onClick={() => this.playVideo(item)} style={{fontSize: 60}} type="play-circle" />
                                                    </div>
                                                </div>
                                            }
                                            {
                                                item.palyStatus && 
                                                <ReactHLS url={item.status === 1 ? 
                                                    item.playUrl : item.status === 2 ? 
                                                    item.objKey : ''} constrols={false}/>
                                            }
                                            {
                                                !item.palyStatus && 
                                                <div 
                                                style={item.status === 1 ? {color: 'green'} : item.status === 2 ? {color: 'red'} : {}}
                                                className="tips-wrap">{item.status === 0 ? '未开始' : 
                                                item.status === 1 ? '进行中' : 
                                                item.status === 2 ? '已结束' : ''}</div>
                                            }
                                        </div>
                                        <div className="right-wrap">
                                            <section className="list-item-detail">
                                                <h3><Link to={{
                                                pathname: '/liveManagement/livePreview',
                                                search: `projectId=${item.id}`
                                            }}>{item.projectName}</Link></h3>
                                            </section>
                                            <section className="list-item-detail">
                                                <span className="created-person">创建人：{item.crtUsrName}</span>
                                                <span className="live-time">时间：{item.beginTm}至{item.endTm}</span>
                                            </section>
                                            <section className="list-item-detail">
                                                直播设备：{
                                                    !!item.deviceList && item.deviceList.length > 0 && 
                                                    // item.deviceList[0].deviceName
                                                    item.deviceList.map((value) => {
                                                        return value.deviceName += ' '
                                                    })
                                                }
                                            </section>
                                        </div>
                                        <div className="list-item-btn-wrap">
                                            <span onClick={() => this.createBk(item)} className="db">云导播</span>
                                            <span className="release-page"><Link to={{
                                                pathname: '/liveManagement/releaseVideo',
                                                search: `projectId=${item.id}`
                                            }} target="_blank">H5发布</Link></span>
                                            <span onClick={()=>this.changeLive(item)} className="modify-live">修改直播</span>
                                            <span className="replay"><Link to={{
                                                pathname: "/liveManagement/deviceReplay",
                                                search: `?projectId=${item.id}`
                                            }}>设备回放</Link></span>
                                            <span onClick={()=>this.pushSteam(item)} className="ztl">转推流</span>
                                            <span className="ct">实时拆条</span>
                                        </div>
                                    </li>
                                )) : 
                                <li className="noData">暂无数据</li>
                            }
                        </ul>
                        {
                            this.state.listData.length > 0 && <Pagination total={1} showSizeChanger showQuickJumper />
                        }
                    </section>
                </div>
                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="确定"
                    cancelText="取消"
                    getContainer={() => document.querySelector('.live-list-wrap')}
                    onCancel={this.handleCancel}
                    >
                        {
                            this.state.modalTitle === '转推流' ? 
                            <Input placeholder="请输入转推流地址" /> :
                            <div className="modal-wrap">
                            <section className="add-device-item">
                                <span>直播名称：</span>
                                <Input onChange={this.addLiveName} 
                                value={this.state.addLive.projectName}
                                style={{width: 300}} placeholder="请填写项目名称" />
                            </section>
                            <section className="add-device-item">
                                <span>直播时间：</span>
                                <RangePicker 
                                    locale={locale} 
                                    style={{width: 300}}
                                    showTime={true}
                                    value={this.state.rangeTimeVlue}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder={['项目开始时间', '项目结束时间']}
                                    onChange={this.changeTime} />
                            </section>
                            <section className="add-device-item">
                                <span>直播地址：</span>
                                <Input 
                                onChange={this.addLiveAddress} 
                                value={this.state.addLive.location}
                                style={{width: 300}} placeholder="请填写直播地址" />
                            </section>
                            <section className="add-device-item">
                                <span>直播描述：</span>
                                <Input onChange={this.addLiveDes} 
                                value={this.state.addLive.describe}
                                style={{width: 300}} placeholder="请填写直播描述" />
                            </section>
                            <section className="add-device-item">
                                <span>直播封面：</span>
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="/api/upload"
                                    beforeUpload={beforeUpload}
                                    onChange={this.handleChange}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                                </Upload>
                            </section>
                            <section className="add-device-item">
                                <span>选择设备：</span>
                                <Select
                                    mode="multiple"
                                    placeholder="请选择设备"
                                    value={this.state.addLive.deviceIdList}                                    
                                    onChange={this.selectDevice}
                                    style={{ width: 300 }}
                                    >
                                    {this.state.deviceList}
                                </Select>
                            </section>
                        </div>
                        }
                </Modal>
            </div>
        )
    }
}


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
  
  function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}


export default LiveList