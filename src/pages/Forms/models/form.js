import { routerRedux } from 'dva/router';
import { message,notification } from 'antd';
import request from '@/utils/request';

export default {
  namespace: 'form',

  state: {
    step: {
      project: ['alipay', 1, 23, 3],
      community: [],
      // housetype: ['老公房', '老洋房', '酒店式公寓', '公寓房', '别墅', '新式里弄', '四合院'],
      srlx: ['房屋租金', '押金', '水费', '电费', '燃气费', '收视费', '宽带费', '物管费', '劳务费'], // 收入类型
      zclx: ['房屋租金', '押金', '水费', '电费', '燃气费', '收视费', '宽带费', '物管费', '劳务费'], // 支出类型
      skfs: ['现金支付', '对公转账', 'POS机支付'], // 收款方式
    },
    form: {},
  },

  effects: {
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    *asyncProject({ payload }, { call, put }) {
      yield put({
        type: 'addProjectName',
        payload,
      });
    },
    *getCommunityName({ payload }, { select, call, put }) {
      let communityArray = new Array()
      const { data } = yield call(getCommunity);

      for( let i in  data) {
        communityArray.push(data[i].communityName)
      }
      yield put({
        type: 'saveCommunity',
        payload: {
          community: communityArray,
        },
      });
    },
    *getProjectName({ payload }, { select, call, put }) {
      let projectArray = new Array()
      const { data } = yield call(getProject);

      for( let i in  data) {
        projectArray.push(data[i].ProjectName)
      }

      yield put({
        type: 'saveProject',
        payload: {
          project: projectArray,
        },
      });
    },
    *saveStepFormData({ payload }, { call, put }) {
      yield put({
        type: 'saveStep1Data',
        payload,
      });
      // yield put(routerRedux.push('/sourcemanage/step-form/confirm'));
      //   router.push('/form/step-form/confirm');
    },
  },

  reducers: {
    saveStep1Data(state, { payload }) {

      addAccountOrder(payload);
      return {
        ...state,
        form: {
          ...payload,
        },
      };
    },
    saveCommunity(state, { payload: { community } }) {
      return { 
        ...state,
        step: {
          ...state.step,
          community
        }};
    },
    saveProject(state, { payload: { project } }) {
      return { 
        ...state,
        step: {
          ...state.step,
          project
        }};
    },
  }
};

export async function addAccountOrder(params){
  return request('/api/account/addOrder', {
    method: 'post',
    data: params
  }).then((data) => {
    notification.success({message:data.info});
  });
}

export async function getCommunity(){
  return request('/api/sourcemanage/getcommunity', {
    method: 'get',
  });
}

export async function getProject(){
  return request('/api/sourcemanage/getproject', {
    method: 'get',
  });
}
