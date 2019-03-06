import React, { Component } from 'react';
import { Input, Button, Table, Modal, message, Select } from 'antd';
// import { withRouter, Link } from 'react-router-dom'
import './index.scss'
import http from '../../../utils/http'

const Search = Input.Search;
const Option = Select.Option;

class SystemAccount extends Component {

    state = {
        columns: [
            {
                title: '账号',
                dataIndex: 'account',
                key: 'account',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '联系方式',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '角色',
                dataIndex: 'roleName',
                key: 'roleName',
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'op',
                render: (text, record) => (
                    <span>
                        <Button type="primary" onClick={() => this.changeItem(record)} style={{marginRight: 10}} size="small">修改</Button>
                        <Button type="danger" onClick={() => this.deleteItem(record)} style={{marginRight: 10}} size="small">删除</Button>
                    </span>
                )
            },
        ],
        data: [],
        modalTitle: '',
        roleList: [],
        visible: false,
        addAccountData: {
            name: '',
            phone: '',
            account: '',
            password: '',
            roleid: ''
        }
    }

    componentDidMount () {
        this.getList()
    }

    getList () {
        http.get('/api/user/list', {})
        .then(res => {
            if (res.code === 200) {
                this.setState({data: res.data})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }
    getRoleList () {
        http.get('/api/role/list', {})
        .then(res => {
            if (res.code === 200) {
                this.setState({roleList: res.data})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }

    changeItem = (record) => {
        this.getRoleList()
        this.setState({
            modalTitle: '修改账号',
            visible: true
        })
    }

    deleteItem = (record) => {
        http.delete('/api/user/delete', {userId: record.id})
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

    handleOk = (e) => {
        http.post('/api/user/add', this.state.addAccountData)
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
        this.handleCancel()
    }

    handleCancel = (e) => {
        const obj = {
            name: '',
            phone: '',
            account: '',
            password: '',
            roleid: ''
        }
        this.setState({
            addAccountData: obj,
            visible: false,
        });
    }
    searchAccount = (value) => {
        let params = new FormData();
        params.append('keywords', value)
        http.post('/api/user/search', params)
        .then(res => {
            if (res.code === 200) {
                this.setState({data: res.data})
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            message.error('网络连接失败，请稍后重试！')
        })
    }

    selectItem = (e, type) => {
        const value = e.target.value;
        this.setState((state) => state.addAccountData[type] = value)
    }

    changeRole = (value) => {
        this.setState((state) => state.addAccountData.roleid = value)
    }

    addAccount = () => {
        this.getRoleList()
        this.setState({
            modalTitle: '添加账号',
            visible: true
        })
    }
    render () {
        return (
            <div className="system-account-wrap">
                <div  className="system-account-content">
                    <div className="item-top-wrap">
                        <h3>系统账号</h3>
                        <div className="item-top-b">
                            <Button 
                                type="primary" 
                                onClick={this.addAccount} 
                                style={{margin: ' 0'}}
                            >+添加账号</Button>
                            <Search
                                placeholder="输入姓名或账号"
                                onSearch={this.searchAccount}
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>
                    <div className="system-account-list-wrap">
                        <Table 
                            rowKey={record => record.id} 
                            columns={this.state.columns} 
                            dataSource={this.state.data}
                            pagination={{showQuickJumper: true, showSizeChanger: true}} />
                    </div>
                </div>
                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="确定"
                    cancelText="取消"
                    getContainer={() => document.querySelector('.system-account-wrap')}
                    onCancel={this.handleCancel}
                    >
                    <div className="modal-wrap">
                        <section className="item">
                            <label htmlFor="username">姓名：</label>
                            <Input 
                                value={this.state.addAccountData.name} 
                                style={{width: '70%'}} 
                                onChange={(e) => this.selectItem(e, 'name')}
                                id="username" 
                                placeholder="请输入姓名" />
                        </section>
                        <section className="item">
                            <label htmlFor="tel">联系方式：</label>
                            <Input 
                                value={this.state.addAccountData.phone} 
                                onChange={(e) => this.selectItem(e, 'phone')}
                                type="tel" 
                                style={{width: '70%'}} 
                                id="tel" 
                                placeholder="请输入联系方式" />
                        </section>
                        <section className="item">
                            <label htmlFor="accountNum">账号：</label>
                            <Input 
                                style={{width: '70%'}} 
                                value={this.state.addAccountData.account} 
                                onChange={(e) => this.selectItem(e, 'account')}
                                id="accountNum" 
                                placeholder="请输入账号" />
                        </section>
                        <section className="item">
                            <label htmlFor="password">密码：</label>
                            <Input 
                                type="password" 
                                value={this.state.addAccountData.password} 
                                onChange={(e) => this.selectItem(e, 'password')}
                                style={{width: '70%'}} 
                                id="password" 
                                placeholder="请输入密码" />
                        </section>
                        <section className="item">
                            <label htmlFor="ss">角色：</label>
                            {/* <Input 
                                style={{width: '70%'}} 
                                value={this.state.addAccountData.roleid} 
                                onChange={(e) => this.selectItem(e, 'roleid')}
                                id="ss" 
                                placeholder="请输入账号" /> */}
                                 <Select placeholder="请选择角色" style={{width: '70%'}} onChange={this.changeRole}>
                                    {
                                        this.state.roleList.length > 0 && this.state.roleList.map((item) => (
                                            <Option key={item.id} value={item.id}>{ item.name }</Option>
                                        ))
                                    }
                                </Select>
                        </section>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default SystemAccount