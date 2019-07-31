/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import axios from 'axios';
import { notification } from 'antd';
import router from 'umi/router';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {} } = error;

  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;

  //闭包
  var closeSure = null;

  if (status === 401) {
    if (closeSure!=null) {
      clearTimeout(closeSure)
    }
    closeSure = setTimeout(()=>{
      notification.error({
        message: '未登录或登录已过期，请重新登录。',
      });
    },100)
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    return;
  }
  //check the response data;
  if (response.data && response.data.hasOwnProperty('info')) {
    notification.error({
      message: response.data.info,
    });
    return;
  }


  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });
  // environment should not be used
  if (status === 403) {
    router.push('/exception/403');
    return;
  }
  if (status <= 504 && status >= 500) {
    router.push('/exception/500');
    return;
  }
  if (status >= 404 && status < 422) {
    router.push('/exception/404');
  }
  // if(!localStorage.getItem("token")){}
};

axios.defaults.baseURL = APP_U;
axios.interceptors.request.use(function (config) {
    if (window.g_app._store.getState().global.token) {
      config = {...config,headers:{
        "Authorization":"Bearer "+window.g_app._store.getState().global.token
      }}
    }
    // Do something before request is sent
  return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

axios.interceptors.response.use((response)=>{
  //check token and add it

  var token = response.headers.authorization
  if (token) {
      token = token.replace(/Bearer /g,'');
      // 如果 header 中存在 token，那么触发 refreshToken 方法，替换本地的 token
      window.g_app._store.dispatch({
        type: 'global/refreshToken',
        payload:token
      });
  }
  if (response.data.code === 0) {
      typeof response.data.info ==='string'?notification.error({
      message:response.data.info
    }):null;
  }
    return Promise.resolve(response.data);
},(error)=>{
  errorHandler(error);
  return Promise.reject(error)
})
const request = axios;
export default request;
