import Loadable from 'react-loadable'
import { DelayLoading } from '../utils/util'

// 设备列表
const DeviceList = Loadable({
    loader: () => import('../views/device/deviceList/index'),
    loading: DelayLoading,
    delay: 300
})

// 回放列表
const ReplayList = Loadable({
    loader: () => import('../views/device/replayList/index'),
    loading: DelayLoading,
    delay: 300
})

// 直播列表
const LiveList = Loadable({
    loader: () => import('../views/live/liveList/index'),
    loading: DelayLoading,
    delay: 300
})

// 直播预览
const LivePreview = Loadable({
    loader: () => import('../views/live/livePreview/index'),
    loading: DelayLoading,
    delay: 300
})

// 设备回放
const DeviceReplay = Loadable({
    loader: () => import('../views/live/deviceReplay/index'),
    loading: DelayLoading,
    delay: 300
})

// 录像管理
const VideoRecording = Loadable({
    loader: () => import('../views/record/videoRecording/index'),
    loading: DelayLoading,
    delay: 300
})

// 台标管理
const LogoManagement = Loadable({
    loader: () => import('../views/logo/index'),
    loading: DelayLoading,
    delay: 300
})

// 系统账号
const SystemAccount = Loadable({
    loader: () => import('../views/account/systemAccount/index'),
    loading: DelayLoading,
    delay: 300
})

// 角色管理
const RoleManagement = Loadable({
    loader: () => import('../views/account/roleManagement/index'),
    loading: DelayLoading,
    delay: 300
})


export default [
    {
        'path': '/deviceManagement/deviceList',
        'component': DeviceList
    },
    {
        'path': '/deviceManagement/replayList',
        'component': ReplayList
    },
    {
        'path': '/liveManagement/liveList',
        'component': LiveList
    },
    {
        'path': '/liveManagement/livePreview',
        'component': LivePreview
    },
    {
        'path': '/liveManagement/deviceReplay',
        'component': DeviceReplay
    },
    {
        'path': '/liveManagement/videotapeManagement',
        'component': VideoRecording
    },
    {
        'path': '/liveManagement/logoManagement',
        'component': LogoManagement
    },
    {
        'path': '/accountManagement/systemAccount',
        'component': SystemAccount
    },
    {
        'path': '/accountManagement/roleManagement',
        'component': RoleManagement
    }
]