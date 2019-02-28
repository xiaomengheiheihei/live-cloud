import React, { Component } from 'react';
import { 
    Breadcrumb, 
    Button, 
    Input, 
    Modal, 
    Select, 
    DatePicker, 
    Icon, 
    Upload, 
    message, 
    Radio,
    Pagination } from 'antd';
import { withRouter, Link } from 'react-router-dom'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import './index.scss'
import moment from 'moment';
// import ReactHLS from 'react-hls';
import Player from '../../components/playerRtmp/player'
import http from '../../../utils/http'

const Option = Select.Option;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;


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
            projectType: 2,
            location: ''
        },
        listTotal: 0,
        ctTime: '2',
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
        ztl: ''
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
                this.setState({listData: res.data.rows, listTotal: Number(res.data.total)})
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
        if (item.status === 1) {
            message.error('正在直播的项目无法更改！');
            return;
        }
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
                projectType: item.projectType,
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
        // if (item.status !== 1) { message.info(`正在进行的项目才可以进行转推流`); return false }
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
            rangeTimeVlue: '',
            ztl: ''
        });
        this.setState(state => state.addLive = {
            projectName: '',
            endTm: '',
            beginTm: '',
            cover: '',
            projectType: 1,
            deviceIdList: [],
            describe: '',
            location: ''
        })
    }
    handleOk = (e) => {
        document.querySelector('.my-spid').classList.add('my-spid-show');
        if (this.state.modalTitle === '新建直播') {
            if (this.state.addLive.projectName === '') {
                message.error('请填写项目名称！');
                document.querySelector('.my-spid').classList.remove('my-spid-show');
                return;
            } else if (this.state.addLive.endTm === '' || this.state.addLive.beginTm === '' ) {
                message.error('请选择项目开始结束时间！');
                document.querySelector('.my-spid').classList.remove('my-spid-show');
                return;
            } else if (this.state.addLive.cover === '') {
                message.error('请上传项目封面！');
                document.querySelector('.my-spid').classList.remove('my-spid-show');
                return;
            } else if (this.state.addLive.deviceIdList.length === 0) {
                message.error('请选择设备！');
                document.querySelector('.my-spid').classList.remove('my-spid-show');
                return;
            }
            http.post('/api/projectInfo/add', this.state.addLive)
            .then(res => {
                if (res.code === 200) {
                    message.success('添加成功！')
                    this.getList(1, 10, "", this.state.currentTab)
                } else {
                    message.error(res.message)
                }
                this.handleCancel()
                document.querySelector('.my-spid').classList.remove('my-spid-show');
            })
            .catch(error => {
                this.handleCancel()
                message.error(`网络连接失败，请稍后重试！`)
                document.querySelector('.my-spid').classList.remove('my-spid-show');
            })
        } else if (this.state.modalTitle === '修改直播') {
            if (this.state.addLive.projectName === '') {
                message.error('请填写项目名称！');
                document.querySelector('.my-spid').classList.remove('my-spid-show');
                return;
            } else if (this.state.addLive.endTm === '' || this.state.addLive.beginTm === '' ) {
                message.error('请选择项目开始结束时间！');
                document.querySelector('.my-spid').classList.remove('my-spid-show');
                return;
            } else if (this.state.addLive.cover === '') {
                message.error('请上传项目封面！');
                document.querySelector('.my-spid').classList.remove('my-spid-show');
                return;
            } else if (this.state.addLive.deviceIdList.length === 0) {
                message.error('请选择设备！');
                document.querySelector('.my-spid').classList.remove('my-spid-show');
                return;
            }
            let obj = { ...this.state.addLive }
            obj.id = this.state.currentItem.id
            http.post('/api/projectInfo/update', obj)
            .then(res => {
                if (res.code === 200) {
                    message.success('修改成功！')
                    this.getList(1, 10, "", this.state.currentTab)
                } else {
                    message.error(res.message)
                }
                this.handleCancel()
                document.querySelector('.my-spid').classList.remove('my-spid-show');
            })
            .catch(error => {
                this.handleCancel()
                message.error(`网络连接失败，请稍后重试！`)
                document.querySelector('.my-spid').classList.remove('my-spid-show');
            })
        } else if (this.state.modalTitle === '实时拆条') {
            let params = {
                name: this.state.currentItem.projectName,
                duration: this.state.ctTime,
                start_time: moment().add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                stream_url: this.state.currentItem.playUrl
            }
            http.post('/api/mediaOnVideo/createLivePorject', params)
            .then(res => {
                this.handleCancel()
                window.open(`https://api.onvideo.cn/api/ajax/enter_onvideo/?username=txq&portal_host=https://qiniu.onvideo.cn&sign=048d3a22a8271b90f6db6e88c25ab0a0&menu=liveList`)
                document.querySelector('.my-spid').classList.remove('my-spid-show');
            })
            .catch(error => {
                this.handleCancel()
                message.error(`网络连接错误，请稍后重试！`);
                document.querySelector('.my-spid').classList.remove('my-spid-show');
            })
        } else if (this.state.modalTitle === '转推流') {
            let params = {
                projectId: parseInt(this.state.currentItem.id),
                transferUrl: this.state.ztl
            };
            http.post("/api/projectInfo/updateTransferUrl", params)
            .then(res => {
                console.log(res)
            }).catch(error => {
                message.error('网络连接失败，请稍后重试！');
            })
            this.handleCancel();
            document.querySelector('.my-spid').classList.remove('my-spid-show');
        }
    }
    changeTime = (date, dateString) => {
        this.setState({rangeTimeVlue: date})
        this.setState(state => state.addLive.beginTm = dateString[0] + ':00')
        this.setState(state => state.addLive.endTm = dateString[1] + ':00')
    }

    ztlFn = (e) => {
        const value = e.target.value;
        this.setState({ztl: value})
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
        if (this.state.addLive.projectType === 1 && value.length > 1) { // 单路直播禁止多个设备
            message.error('单路直播只允许选择一个设备！');
            return;
        }
        this.setState((state => state.addLive.deviceIdList = value))
    }
    changeProjectType = (e) => {
        const value = e.target.value;
        this.setState((state => state.addLive.projectType = value))
    }

    searchList = (e) => {
        let value = e.target.value;
        this.getList(1, 10, value,this.state.currentTab);
    }

    playVideo = (item, e) => {
        e.preventDefault();
        if (item.status === 2 || item.status === 0) { return false }
        this.setState((state) => {
            for (let value of state.listData) {
                if (item.id === value.id) {
                    value.palyStatus = !value.palyStatus
                }
            }
            return state.listData
        })
    }
    gotoOnvideo = (item) => {
        if (item.status !== 1) { message.info(`正在进行的项目才可以进行实时拆条`); return false }
        this.setState({
            visible: true,
            modalTitle: '实时拆条',
            currentItem: item
        });
    }
    getCtTime = (value) => {
        this.setState({ctTime: value})
    }
    pageChange = (page, pageSize) => {
        this.getList(page, pageSize, '', '');
    }
    render () {
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">上传封面</div>
            </div>
        );
        const ctTimeList = () => {
            let option = [];
            for (let i = 0.5; i <= 24; i += 0.5) {
                option.push(<Option key={i}>{i}小时</Option>);
            }
            return option;
        }
        const disabledDate = (current) => (
            current && current < moment().subtract(1, 'day')
        )
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
                                <Input
                                    placeholder="输入设备名"
                                    onChange={this.searchList}
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
                                                        <Icon onClick={(e) => this.playVideo(item, e)} style={{fontSize: 60}} type="play-circle" />
                                                    </div>
                                                </div>
                                            }
                                            {
                                                item.palyStatus && 
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
                                            <section className="list-item-detail item-device-list">
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
                                            <span onClick={() => this.gotoOnvideo(item)} className="ct">实时拆条</span>
                                        </div>
                                    </li>
                                )) : 
                                <li className="noData">暂无数据</li>
                            }
                        </ul>
                        {
                            this.state.listData.length > 0 && <Pagination showSizeChanger showQuickJumper defaultCurrent = {1}
                            total = {this.state.listTotal}
                            onChange = {(page, pageSize)=>this.pageChange(page, pageSize)} />
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
                            <Input value={this.state.ztl} onChange={this.ztlFn} placeholder="请输入转推流地址" /> :
                            this.state.modalTitle === '实时拆条' ?
                            <div className="ct-wrap">
                                <span>选择拆条时长：</span>
                                <Select
                                    placeholder="请选择时长"
                                    defaultValue={this.state.ctTime}  
                                    value={this.state.ctTime}  
                                    style={{width: 300}}                                  
                                    onChange={this.getCtTime}
                                >
                                    {ctTimeList()}
                                </Select>
                            </div> :
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
                                        disabledDate={disabledDate}
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
                                    style={{width: 300}} placeholder="请填写直播地址(如：北京)" />
                                    <span className="add-tips">(选填)</span>
                                </section>
                                <section className="add-device-item">
                                    <span>直播描述：</span>
                                    <Input onChange={this.addLiveDes} 
                                    value={this.state.addLive.describe}
                                    style={{width: 300}} placeholder="请填写直播描述" />
                                    <span className="add-tips">(选填)</span>
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
                                    <span>直播模式：</span>
                                    <RadioGroup onChange={this.changeProjectType} value={this.state.addLive.projectType}>
                                        <Radio value={2}>云导播</Radio>
                                        <Radio value={1}>单路直播</Radio>
                                    </RadioGroup>
                                </section>
                                <section className="add-device-item">
                                    <span>选择设备：</span>
                                    <Select
                                        mode="multiple"
                                        placeholder="请选择设备"
                                        value={this.state.addLive.deviceIdList}                                    
                                        onChange={this.selectDevice}
                                        style={{ width: 300 }}
                                        dropdownClassName="add-drop-list"
                                        getPopupContainer = {() => document.querySelector('.live-list-wrap')}
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
      message.error('只支持JPG格式！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片需小于2MB!');
    }
    return isJPG && isLt2M;
}


export default LiveList