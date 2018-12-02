import React, { Component } from 'react';
import { Breadcrumb, Button, DatePicker, Icon, Table, message } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import http from '../../../utils/http'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import './index.scss'


const { RangePicker } = DatePicker;

@withRouter
class ReplayList extends Component {
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
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
            },
            {
                title: '创建账号',
                dataIndex: 'crtName',
                key: 'crtName',
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'op',
                render: (text, record) => (
                    <span>
                        <Button type="danger" onClick={() => this.deleteItem(record)} style={{marginRight: 10}} size="small">删除</Button>
                        <Button size="small">回放</Button>
                    </span>
                )
            },
        ],
        data: []
    }

    componentDidMount () {
        this.getList()
    }

    getList (current=1,size=10) {
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
        http.delete('/api/streamingHisInfo/delete', {streamingHisInfoId: record.id})
        .then(res => {
            if (res.code === 200) {
                message.success('删除成功！')
                this.getList()
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }
    changeTime = (date, dateString) => {        // 按时间检索

    }
    render () {
        return (
            <div className="replay-list-wrap">
                <Breadcrumb className="my-breadcrumb">
                    <Breadcrumb.Item>设备管理</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/deviceManagement/deviceList">设备列表</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>回放列表</Breadcrumb.Item>
                </Breadcrumb>
                <div className="replay-list-content">
                    <div className="replay-list-top clear">
                        {
                           this.state.data.length > 0 && <h3>{this.state.data[0].deviceName} 回放列表</h3>
                        }
                        <div><RangePicker 
                            locale={locale} 
                            suffixIcon={<Icon type="search" />}
                            placeholder={['推流开始时间', '推流结束时间']}
                            onChange={this.changeTime} /></div>
                    </div>
                    <div className="push-address">
                        <span>推流地址：</span>
                        {this.state.data.length > 0 && this.state.data[0].pushUrl}
                    </div>
                    <div className="replay-list-table">
                        <Table 
                            rowKey={record => record.pushUrl} 
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

export default ReplayList