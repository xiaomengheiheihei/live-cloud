import React, { Component } from 'react';
import { Breadcrumb, Button, Input, Table, message } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import http from '../../../utils/http'
import './index.scss'

const Search = Input.Search;

@withRouter
class DeviceReplay extends Component {
    state = {
        columns: [
            {
                title: '开始时间',
                dataIndex: 'beginTm',
                key: 'beginTm',
            },
            {
                title: '结束时间',
                dataIndex: 'endTm',
                key: 'endTm',
            },
            {
                title: '设备名称',
                dataIndex: 'deviceName',
                key: 'deviceName',
            },
            {
                title: '管理人员',
                dataIndex: 'crtName',
                key: 'crtName',
            },
            {
                title: '联系方式',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'op',
                render: (text, record) => (
                    <span>
                        <Button type="danger" onClick={() => this.deleteItem(record)} style={{marginRight: 10}} size="small">删除</Button>
                        <Button type="primary" size="small">播放</Button>
                    </span>
                )
            },
        ],
        data: []
    }
    componentDidMount () {
        this.getList()
    }

    getList (current=1, size=10) {
        let params = {
            current: current,
            size: size,
            deviceId: this.props.location.search.split('=')[1]
        }
        http.get('/api/streamingHisInfo/list', params)
        .then(res => {
            if (res.code === 200) {
                this.setState({data: res.data.records})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }
    deleteItem = (record) => {      // 删除项目
        http.delete(`/api/streamingHisInfo/delete`, {streamingHisInfoId: record.id})
        .then(res=> {
            if (res.code === 200) {
                message.success(`删除成功！`)
                this.getList()
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error(`网络连接失败，请稍后重试！`)
        })
    }
    render () {
        return (
            <div className="device-replay-wrap">
                <Breadcrumb className="my-breadcrumb">
                    <Breadcrumb.Item>直播管理</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/liveManagement/liveList">直播列表</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>设备回放</Breadcrumb.Item>
                </Breadcrumb>
                <div className="replay-list-content">
                    <div className="replay-list-top clear">
                        <h3>{this.state.data.length > 0 && this.state.data[0].projectName}</h3>
                        <div>
                            <Search
                                placeholder="输入设备名"
                                onSearch={value => console.log(value)}
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>
                    <div className="replay-list-table">
                        <Table 
                            rowKey={record => record.id} 
                            columns={this.state.columns} 
                            dataSource={this.state.data}
                            pagination={{
                                showQuickJumper: true, 
                                showSizeChanger: true,
                            }} />
                    </div>
                </div>
            </div>
        )
    }
}

export default DeviceReplay