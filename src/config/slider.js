export default [
    {
        key   : '/deviceManagement',
        title : '设备管理',
        icon  : 'shebeiguanli',
        list  : [{
            key   : '/deviceList',
            title : '设备列表'
        }]
    },
    {
        key   : '/liveManagement',
        title : '直播管理',
        icon  : 'zhiboguanli-',
        list  : [{
            key   : '/liveList',
            title : '直播列表'
        },{
            key   : '/videotapeManagement',
            title : '录像管理'
        },{
            key   : '/logoManagement',
            title : '台标管理'
        }]
    },
    {
        key   : '/accountManagement',
        title : '账号管理',
        icon  : 'ziyuan',
        list  : [{
            key   : '/systemAccount',
            title : '系统账号'
        },
        {
            key   : '/roleManagement',
            title : '角色管理'
        }
        ]
    },
    {
        key   : '/commandDispatch',
        title : '指挥调度',
        icon  : 'shebeiguanli',
        list  : []
    },
]