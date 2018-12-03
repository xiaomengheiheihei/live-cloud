import React, { Component } from 'react';
import { Breadcrumb, message, Upload, Icon, Button } from 'antd';
// import { withRouter, Link } from 'react-router-dom'
import './index.scss'
import http from '../../utils/http'


class LogoManagement extends Component {
    
    state = {
        loading: false,
        choosePosi: 0,
        logo: ''
    }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                logo: info.file.response.data
            })
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));
        }
    }

    choosePosition = (type) => {
        if (this.state.choosePosi === type) { return false }
        this.setState({
            choosePosi: type
        })
    }
    submit = () => {
        if (!this.state.imageUrl) {
            message.error('请上传logo')
            return false
        } else {
            let params = new FormData()
            params.append('objKey', '/' + this.state.logo.split('com/')[1])
            params.append('location', this.state.choosePosi)
            http.post('/api/logo/add', params)
            .then(res => {
                if (res.code === 200) {
                    message.success('添加成功！')
                } else {
                    message.error(res.message)
                }
            })
            .catch(error => {
                message.error('网络连接失败，请稍后重试！')
            })
        }
    }

    render () {
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">上传角标</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;

        return (
            <div className="logo-management-wrap">
                <Breadcrumb className="my-breadcrumb">
                    <Breadcrumb.Item>直播管理</Breadcrumb.Item>
                    <Breadcrumb.Item>台标管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className="logo-management-content">
                    <h2>台标管理</h2>
                    <div className="logo-management-main">
                        <h3>台标LOGO</h3>
                        <p>推荐分辨率为300、PNG格式</p>
                        <div className="setting-logo">
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
                            <div className="logo-position">
                                <h3>LOGO位置</h3>
                                <div>
                                    <span className={this.state.choosePosi === 0 ? 'choose' : ''} onClick={() => this.choosePosition(0)}>左上</span>
                                    <span className={this.state.choosePosi === 1 ? 'choose' : ''} onClick={() => this.choosePosition(1)}>右上</span>
                                    <span className={this.state.choosePosi === 2 ? 'choose' : ''} onClick={() => this.choosePosition(2)}>左下</span>
                                    <span className={this.state.choosePosi === 3 ? 'choose' : ''} onClick={() => this.choosePosition(3)}>右下</span>
                                </div>
                            </div>
                        </div>
                        <Button onClick={this.submit} className="submit" type="primary">提交</Button>
                    </div>
                </div>
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


export default LogoManagement