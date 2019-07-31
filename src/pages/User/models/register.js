import router from 'umi/router';
import { fakeRegister,fakeChangePwd } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { notification } from 'antd';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload ,callback }, { call, put }) {
      const response = yield call(fakeRegister, payload);
     
      if (response.code ===1) {
        notification.success({
          message: '注册成功!',
        });
      };
    
      setTimeout(()=>{
        router.push('/user/login')
      },2000)
    },
    *reset({ payload }, { call, put }) {
      const response = yield call(fakeChangePwd, payload);
      if (response.code ===1) {
        notification.success({
          message: '重置成功!',
        });
      };
      setTimeout(()=>{
        router.push('/user/login')
      },2000)

    },
  },

  reducers: {
    registerHandle(state, { payload }) {

      //setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
