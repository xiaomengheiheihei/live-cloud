import axios from 'axios'
import Cookies from 'js-cookie'

axios.defaults.baseURL = '';


axios.interceptors.response.use(
    response => {
        if (response.data.code === 700) {
            Cookies.remove('Authorization');
            window.location.reload();
        } else {
            return response;
        }
    }
)

export default {
    post: (url,params = {}) => {
        return new Promise((resolve, reject) => {
            axios.post(url, params)
            .then (response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
        })
    },
    get: (url,params = {}) => {
        return new Promise((resolve, reject) => {
            axios.get(url, {params})
            .then (response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
        })
    },
    put: (url,params = {}) => {
        return new Promise((resolve, reject) => {
            axios.put(url, {params})
            .then (response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
        })
    },
    delete: (url,params = {}) => {
        return new Promise((resolve, reject) => {
            axios.delete(url, {params})
            .then (response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
        })
    }
}