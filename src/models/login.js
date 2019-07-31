import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { notification } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(fakeAccountLogin, payload);
      // Login successfully
        yield put({
          type: 'changeLoginStatus',
          payload: response.data.userInfo,
        });
        yield put({
          type: 'global/refreshToken',
          payload: response.data.token,
        });
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
     
      } catch (error) {
        const { response = {} } = error;
      if (response.data.code === 2 ) {
        yield put(
          routerRedux.push({
            pathname: '/user/register'
          })
        );
      }  
      }
      
    },

    *getCaptcha({ payload, callback }, { call }) {
      const response = yield call(getFakeCaptcha, payload);
      callback(response);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          type: 'guest',
        },
      });
      //  localStorage.setItem("token",'');
      reloadAuthorized();
      // redirect
      if (window.location.pathname !== '/user/login') {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.type);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
