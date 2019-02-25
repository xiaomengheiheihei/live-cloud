import React, { Component } from 'react';
import { Avatar, Button, message, Modal, Radio, Upload, Icon } from 'antd';
import http from '../../../utils/http'
import { withRouter } from 'react-router-dom'
import './index.scss'
import Player from '../../components/playerRtmp/player'
import Cookies from 'js-cookie'

const RadioGroup = Radio.Group;

let videoUrl = ''

const props = {
    multiple: false,
    accept: 'video/mp4',
    action: '/api/upload',
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            videoUrl = info.file.response.data
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

@withRouter
class H5Page extends Component {

    state = {
        commentList: [],
        projectInfo: {},
        currentMessage: '',
        visible: false,
        value: 1,
        previewVisible: false,
        previewImage: '',
        fileList: [],
        liveTitle: '',
        imgTxtInfo: null,
        playerOption: {
            autoPlay: "muted",
            preload: "auto",
            techOrder: ["html5","flash"],
            plugins: {},
            controls: true,
            language: 'zh-CN',
            overNative: true,
            sourceOrder: true,
        },
    }

    componentDidMount () {
        this.getProjectInfo()
        this.getMsgList()
        this.getProjectTxtImgInfo()
    }
    
    componentDidUpdate () {
        this.refs.scrollAre.scrollTop = this.refs.scrollAre.scrollHeight
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
    getProjectTxtImgInfo () {
        http.get(`/api/projectBroadcast/list`, {current:1, size: 10, projectId: this.props.location.search.split('=')[1]})
        .then(res => {
            if (res.code === 200) {
                res.data.records.length > 0 && this.setState({imgTxtInfo: res.data.records[0]})
                // this.setState({projectInfo: res.data})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error(`网络连接失败，请稍后重试！`)
        })
    }

    getMsgList (scroll='') {
        http.get(`/api/projectMessage/list`, {projectId: this.props.location.search.split('=')[1],current: 1, size: 100})
        .then(res => {
            if (res.code === 200) {
                this.setState({commentList: res.data.records})
                if (scroll !== '') {
                    this.refs.scrollAre.scrollTop = this.refs.scrollAre.scrollHeight
                }
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error(`网络连接失败，请稍后重试！`)
        })
    }

    addMessage = () => {
        if (!this.state.currentMessage) { message.error('留言不能为空!'); return false }
        const params = {
            content: this.state.currentMessage,
            projectId: this.props.location.search.split('=')[1],
        }
        http.post(`/api/projectMessage/add`, params)
        .then(res => {
            if (res.code === 200) {
                this.getMsgList('scroll')
                this.setState({currentMessage: ''})
                this.refs.mesInput.value = ''
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error(`网络连接失败，请稍后重试！`)
        })
    }
    inputMenssage = (e) => {
        const value = e.target.value
        this.setState({currentMessage: value})
    }

    replaymsg = (item) => {
        this.refs.mesInput.focus();
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    handleCancelIMG = () => {
        this.setState({ previewVisible: false })
    }

    handleOk = () => {
        let arr = []
        this.state.fileList.map(item => arr.push(item.response.data))
        // if (!this.state.liveTitle) { message.error('留言不能为空!'); return false }
        const params = {
            content: this.state.liveTitle,
            projectId: this.props.location.search.split('=')[1],
            vedioUrl: videoUrl,
            imageUrl: arr
        }
        http.post(`/api/projectBroadcast/add`, params)
        .then(res => {
            if (res.code === 200) {
                let obj = {
                    content: this.state.liveTitle,
                    crtTm: '1111',
                    imageUrl: arr,
                    vedioUrl: videoUrl
                }
                this.setState({imgTxtInfo: obj})
                message.success(`添加成功！`)
                this.handleCancel()
                videoUrl = ''
                this.setState({liveTitle: '', fileList: []})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error(`网络连接失败，请稍后重试！`)
        })
    }

    addLiveMsg = (e) => {
        this.setState({liveTitle: e.target.value})
    }

    changeUplodType = (e) => {
        this.setState({
            value: e.target.value,
        });
    }

    handleChange = ({ fileList }) => this.setState({ fileList })
    handlePreview = (file) => {
        this.setState({
          previewImage: file.response.data,
          previewVisible: true,
        });
    }

    render () {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (
            <div className="h5-page-wrap">
                <h1>{this.state.projectInfo && this.state.projectInfo.projectName}</h1>
                <span>
                    <i style={{fontSize: 20}} className={'iconfont live-cloud-renshu'}></i>
                    10000
                </span>
                <div className="main clear">
                    <div className="left">
                        {   this.state.projectInfo.playUrl && 
                            <Player sources={[
                                {
                                    type: "rtmp/mp4",
                                    src: `${this.state.projectInfo.playUrl}`
                                }
                            ]} playerOption={this.state.playerOption} />
                        }
                        {
                            Cookies.get('Authorization') && <p className="play-url">观看直播地址：{window.location.href}</p>
                        }
                        <div className="user-info-wrap">
                            <div className="top">
                                <span className="title">图文直播</span>
                                {
                                    Cookies.get('Authorization') && <span onClick={() => this.setState({visible: true})} className="btn">发布直播内容</span>
                                }
                            </div>
                            <div className="text-img-wrap clear">
                                <div className="img-wrap">
                                    <Avatar src="http://pa7alqn92.bkt.clouddn.com/20181211-1fe368ab-cc1c-47d7-8eff-4a263c7de215.png" />
                                </div>
                                {
                                    this.state.imgTxtInfo &&
                                    <div className="text-wrap">
                                        <div className="title-time">
                                            <span className="title">主播</span>
                                            <span className="time">{this.state.imgTxtInfo.crtTm}</span>
                                        </div>
                                        <div className="content">
                                            <p>{this.state.imgTxtInfo.content}</p>
                                            <ul className="clear">
                                                {
                                                    this.state.imgTxtInfo.imageUrl && this.state.imgTxtInfo.imageUrl.length > 0 && this.state.imgTxtInfo.imageUrl.map(item => (
                                                        <li key={item}>
                                                            <img src={item} alt="" />
                                                        </li>
                                                    )) 
                                                }
                                            </ul>
                                            {
                                                this.state.imgTxtInfo.vedioUrl &&
                                                <div style={{marginTop: 20, width: 200, height: 110}}>
                                                    <video style={{width: '100%'}} src={this.state.imgTxtInfo.vedioUrl}></video>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h3>互动直播</h3>
                        <div ref="scrollAre" className="scroll-wrap">
                            {
                                this.state.commentList.reverse().map((item, i) => (
                                    <section className="item" key={item.id}>
                                        <div className="top clear">
                                            <div className="left">
                                                <Avatar src={'http://pa7alqn92.bkt.clouddn.com/20181211-1fe368ab-cc1c-47d7-8eff-4a263c7de215.png'} />
                                                <span>{item.crtUsr}</span>
                                            </div>
                                            <span>{item.crtTm}</span>
                                        </div>
                                        <div className="content">
                                            {item.content}
                                        </div>
                                        <div className="replay"><span onClick={() => this.replaymsg(item)}>回复</span></div>
                                    </section>
                                ))
                            }
                        </div>
                        <textarea ref="mesInput" onBlur={this.inputMenssage} rows="6" style={{width: '100%', border: '1px solid #ccc', borderRadius: 5, marginTop: 15}} />
                        <div className="submit">
                            <Button onClick={this.addMessage} type="primary">发表</Button>
                        </div>
                    </div>
                </div>
                <Modal
                    title={'发布图文直播'}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="发布"
                    cancelText="取消"
                    getContainer={() => document.querySelector('.h5-page-wrap')}
                    onCancel={this.handleCancel}
                    >
                    <div className="modal-body-wrap">
                        <div className="item">
                            <span>发布直播：</span>
                            <textarea onChange={this.addLiveMsg} rows="6" style={{width: '80%'}} />
                        </div>
                        <div className="item">
                            <span>上传素材：</span>
                            <RadioGroup onChange={this.changeUplodType} value={this.state.value}>
                                <Radio value={1}>上传图片</Radio>
                                <Radio value={2}>上传视频</Radio>
                            </RadioGroup>
                            {
                                this.state.value === 1 ? 
                                <div className="clearfix">
                                    <Upload
                                        action="/api/upload"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                    >
                                    {fileList.length >= 6 ? null : uploadButton}
                                    </Upload>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                        <img alt="1" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                </div> :
                                <div className="upload-video">
                                    <Upload {...props}>
                                        <Button>
                                        <Icon type="upload" /> 上传视频
                                        </Button>
                                    </Upload>
                                </div>
                            }
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default H5Page