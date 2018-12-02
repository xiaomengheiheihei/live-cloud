import React, { Component } from 'react';
import { Breadcrumb, Button, Input, Table, Modal, Select, AutoComplete, message } from 'antd';
import { withRouter } from 'react-router-dom'
import http from '../../../utils/http'
import './index.scss'

const Search = Input.Search;
const Option = Select.Option;
const OptionSearch = AutoComplete.Option;


@withRouter
class DeviceList extends Component {
    state = {
        columns: [
            {
                title: '设备ID',
                dataIndex: 'deviceId',
                key: 'deviceId',
            },
            {
                title: '设备名',
                dataIndex: 'deviceName',
                key: 'deviceName',
            },
            {
                title: '创建时间',
                dataIndex: 'crtTm',
                key: 'crtTm',
            },
            {
                title: '使用人员',
                dataIndex: 'userName',
                key: 'userName',
            },
            {
                title: '设备状态',
                dataIndex: 'deviceStatus',
                key: 'deviceStatus',
                render: (text) => (text === 1 ? <span>推流中</span> : <span>未推流</span>)
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'op',
                render: (text, record) => (
                    <span>
                        <Button type="primary" onClick={()=>this.showAddress(record)} style={{marginRight: 10}} size="small">地址</Button>
                        <Button type="primary" onClick={() => this.changeItem(record)} style={{marginRight: 10}} size="small">修改</Button>
                        <Button type="danger" onClick={() => this.deleteDevice(record)} style={{marginRight: 10}} size="small">删除</Button>
                        <Button onClick={()=> this.props.history.push('/deviceManagement/replayList?deviceId=' + record.id)} size="small">回放列表</Button>
                    </span>
                )
            },
        ],
        data: [],
        visible: false,
        dataSource: [],
        userList: [],
        modalTitle: '',
        currentItem: {},
        currentTab: 1,
        addData: {
            deviceName: '',
            deviceType: '1',
            userId: ''
        }
    }

    componentDidMount () {
        this.getList()
        this.getUsers()
    }

    getUsers () {
        let data = new FormData()
        data.append('keywords', '')
        http.post('/api/user/search', data)
        .then(res => {
            if (res.code === 200) {
                this.setState({userList: res.data})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }

    getList (current=1, size=10, name="", status="") {
        let params = {
            current: current,
            size: size,
            name: name,
            status: status
        }
        http.get('/api/deviceInfo/list', params)
        .then(res => {
            if (res.code === 200) {
                this.setState({data: res.data.rows})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }

    handleOk = (e) => {
        this.setState({
          visible: false,
        });
        let params = { ...this.state.addData }
        params.deviceType = parseInt(params.deviceType)
        params.userId = parseInt(params.userId)
        if (this.state.modalTitle === '添加设备') {
            http.post('/api/deviceInfo/add', params)
            .then(res => {
                if (res.code === 200) {
                    message.success('添加成功！')
                    this.getList()
                } else {
                    message.error(res.message)
                }
            })
            .catch(error => {
                message.error('网络连接失败，请稍后重试！')
            })
        } else {
            params.id = this.state.currentItem.id;
            http.put('/api/deviceInfo/update', params)
            .then(res => {
                if (res.code === 200) {
                    message.success('修改成功！')
                    this.getList()
                } else {
                    message.error(res.message)
                }
            })
            .catch(error => {
                message.error('网络连接失败，请稍后重试！')
            })
        }
    }

    changeItem = (record) => {      // 修改
        this.setState({visible: true, modalTitle: '修改设备'})
        this.setState((state) => state.currentItem = record)
    }

    showAddress = (record) => {     // 显示地址
        this.setState({visible: true, modalTitle: '地址'})
        this.setState((state) => state.currentItem = record)
    }

    deleteDevice = (record) => {        // 删除
        http.delete('/api/deviceInfo/delete', {id: record.id})
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

    changeList = (type) => {            // 改变列表状态
        this.setState({currentTab: type})
        let status = '';
        switch (type) {
            case 2:
                status = 1
                break;
            case 3:
                status = 0
                break;
            default:
                break;
        } 
        this.getList(1, 10, "",status);
    }
    
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleSearch = (value) => {
        this.setState((state, props) => {
            if (!value) {
                return state.dataSource = []
            } else {
                let arr = []
                for (let item of state.userList) {
                    let temp = {
                        name: item.name,
                        id: item.id
                    };
                    arr.push(temp)
                }
                return state.dataSource = arr
            }
        });
    }
    selectUser = (value) => {
        this.setState((state) => state.addData.userId = value)
    }
    selectDevice = (value) => {
        this.setState((state) => state.addData.deviceType = value)
    }
    selectDeviceName = (e) => {
        const value = e.target.value;
        this.setState((state) => state.addData.deviceName = value)
    }
    gotoReplay = () => {
        this.setState({visible: true, modalTitle: '添加设备'})
    }
    render () {
        const { dataSource } = this.state;
        const children = dataSource.map((item) => {
            return <OptionSearch key={item.id}>{item.name}</OptionSearch>;
        });
        return (
            <div className="device-list-wrap">
                <Breadcrumb className="my-breadcrumb">
                    <Breadcrumb.Item>设备管理</Breadcrumb.Item>
                    <Breadcrumb.Item>设备列表</Breadcrumb.Item>
                </Breadcrumb>
                <div className="device-list-content">
                    <Button type="primary" onClick={this.gotoReplay} style={{margin: '20px 0'}}>添加设备</Button>
                    <section className="device-list-list-wrap">
                        <div className="top clear">
                            <h3 className="list-title">设备列表</h3>
                            <div className="right">
                                <div className="tabs-wrap">
                                    <span 
                                        style={{borderTopLeftRadius: 5,borderBottomLeftRadius: 5}} 
                                        onClick={() => this.changeList(1)}
                                        className={this.state.currentTab === 1 ? 
                                        'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>全部</span>
                                    <span 
                                        style={{borderRight: 0, borderLeft: 0}} 
                                        onClick={() => this.changeList(2)}
                                        className={this.state.currentTab === 2 ? 
                                        'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>推流中</span>
                                    <span 
                                        style={{borderTopRightRadius: 5, borderBottomRightRadius: 5}} 
                                        onClick={() => this.changeList(3)}
                                        className={this.state.currentTab === 3 ? 
                                        'tabs-btn-item tabs-btn-choose' : 'tabs-btn-item'}>未推流</span>
                                </div>
                                <Search
                                    placeholder="输入设备名"
                                    onSearch={value => this.getList(1, 10, value, '')}
                                    style={{ width: 200 }}
                                />
                            </div>
                        </div>
                        <Table 
                            rowKey={record => record.id} 
                            columns={this.state.columns} 
                            dataSource={this.state.data}
                            pagination={{showQuickJumper: true, showSizeChanger: true}} />
                    </section>
                </div>
                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="确定"
                    cancelText="取消"
                    getContainer={() => document.querySelector('.device-list-wrap')}
                    onCancel={this.handleCancel}
                    >
                    {
                        this.state.modalTitle === '地址' ? <ShowAddressContent data={this.state.currentItem} /> : 
                        <div>
                            <section className="add-device-item">
                                <span>设备名称：</span>
                                <Input onChange={this.selectDeviceName} style={{width: 200}} placeholder="填写设备名称" />
                            </section>
                            <section className="add-device-item">
                                <span>设备类型：</span>
                                <Select defaultValue="1" style={{ width: 200 }} onChange={this.selectDevice}>
                                    <Option value="1">手机</Option>
                                    <Option value="3">执法记录仪</Option>
                                    <Option value="2">无人机</Option>
                                </Select>
                            </section>
                            <section className="add-device-item">
                                <span>使用人员：</span>
                                <AutoComplete
                                    // dataSource={dataSource}
                                    style={{ width: 200 }}
                                    onSelect={this.selectUser}
                                    onSearch={this.handleSearch}
                                    placeholder="输入并选择使用者"
                                >
                                    {children}
                                </AutoComplete>
                            </section>
                        </div>
                    }
                </Modal>
            </div>
        )
    }
}

function ShowAddressContent (props) {
    return (
        <div>
            <section className="add-device-item">
                <span>设备ID：{props.data.deviceId}</span>
            </section>
            <section className="add-device-item">
                <span>设备名：{props.data.deviceName}</span>
            </section>
            <section className="add-device-item">
                <span>推流地址：</span>
                <p>{props.data.pushUrl}</p>
            </section>
            <section className="add-device-item">
                <span>播出地址：</span>
                <p>{props.data.playUrl}</p>
            </section>
        </div>
    )
}

export default DeviceList