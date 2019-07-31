import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import {
  getCurrentAllData,
  addProject,
  deleteProject,
  addCommunity,
  deleteCommunity,
  getProject,
  getCommunity,
  submitSourceHouse,
  searchData,
  updateRooms,
  deleteRent,
  checkBackreq
 } from '@/services/api';
export default {
  namespace: 'sourceConfig',

  state: {
    step: {
      project: [],
      community: [],
      housetype: ['老公房', '老洋房', '酒店式公寓', '公寓房', '别墅', '新式里弄', '四合院'],
    },

    form: {
    },
    models:[],
    lists:[]
  },

  effects: {
    *DeleteRent({payload ,callback},{call}){
      try {
        const response = yield call(deleteRent,payload);

        if(response.code === 1){
          callback()
        }

      } catch (error) {
        
      }
    },
    *checkBack({payload ,callback},{call}){
      try {
        const response = yield call(checkBack,payload);

        if(response.code === 1){
          callback()
        }

      } catch (error) {
        
      }
    },
    *search({ payload },{ call,put }){
      try {
        const data = yield call(searchData,payload);
        if (data.code!=0) {
          yield put({
            type:"handleAsyncLists",
            payload:data.data
          })
        }
      } catch (e) {

      } finally {

      }
    },
    *resetForm(_,{put}){
      yield put({
        type:"initial"
      })
    },
    *updaterooms({payload},{ call, put }){
        try {
          const res = yield call(updateRooms,payload);
          if (res.code ==1 ) {
            notification.success({
              message:res.info,
            });
            yield put(routerRedux.push('/sourcemanage/center'));
          }
        } catch (error) {
          
        }
    },
    *deleteListsMeta({ payload ,callback},{ call,put }){
      const { id, type } = payload;
      try {
        if (type == 'project') {
          const response  =  yield call(deleteProject,{id})
          yield put({
            type:"handleRemoveProject",
            payload:{id}
          })
        }else{
          const response  =  yield call(deleteCommunity,{id})
          notification.success({
            message:response.info,
          });
          callback(response.code)
          yield put({
            type:"handleRemoveCommunity",
            payload:{id}
          })
        }
      } catch (e) {
        notification.error({
          message:e.message,
        });
      }

    },
    *getproject(_,{ call, put}){
      const response =  yield call(getProject);
      yield put({
        type:"mergeProject",
        payload:response.data
      })
    },
    *getcommunity(_,{ call, put}){
      const response =  yield call(getCommunity);
      yield put({
        type:"mergeCommunity",
        payload:response.data
      })
    },
    *addProject({ payload },{ call, put}){
      try {
          const response = yield call(addProject,payload);

          yield put({
            type:"mergeProject",
            payload:response.data
          })
      } catch (e) {

      }
    },
    *addCommunity({ payload ,callback },{ call, put}){
      try {
          const response = yield call(addCommunity,payload);
          notification.success({
            message:response.info,
          });
          yield put({
            type:"mergeCommunity",
            payload:response.data
          })
          callback()
      } catch (e) {
        return false;
        notification.error({
          message: e.message,
        });
      }
    },
    *removeModel({payload},{call,put}){
      yield put({
        type:"removeModelsOptions",
        payload
      })
    },
    *getCurrentModels(_,{ call , put}){
      const response = yield call(getCurrentAllData);
      yield put({
        type:"patchDatas",
        payload:response.data.data.map((val,index)=>Object.assign({},val,{model:JSON.parse(val.model)}))
      })
    },

    *asyncProject({ payload }, { call, put }) {
      yield put({
        type: 'addProjectName',
        payload,
      });
    },
    *communityName({ payload }, { call, put }) {
      yield put({
        type: 'addCommunityName',
        payload,
      });
    },
    *submitStepOne({ payload }, { call, put }) {
      yield put({
        type: 'saveStep1Data',
        payload,
      });
      yield put(routerRedux.push('/sourcemanage/AddHouse/confirm'));
      //   router.push('/form/step-form/confirm');
    },
    *submitStepTwo({ payload }, { call, put }) {
      try {
        const reponse =  yield call(submitSourceHouse, payload);
        yield put(routerRedux.push('/sourcemanage/AddHouse/result'));
      } catch (e) {

      }

    //  yield put(routerRedux.push('/form/AddHouse/result'));
    },

  },

  reducers: {
    handleAsyncLists(state,{ payload }){
      return {
        ...state,
        lists:payload
      }
    },
    initial(state){
      return {
        ...state,
        form:{}
      }
    },
    handleRemoveCommunity(state,{payload}){
      return {
        ...state,
        step:{
          ...state.step,
          community:state.step.community.filter(val=>val.id!==payload.id)
        }
      }
    },
    handleRemoveProject(state,{payload}){
      return {
        ...state,
        step:{
          ...state.step,
          project:state.step.project.filter(val=>val.id!==payload.id)
        }
      }
    },
    mergeProject(state,{ payload }){
      let res=new Map();
      let project = state.step.project.concat(payload);
      project.forEach(item=>{
        res.set(JSON.stringify(item),item);
      });
      return {
        ...state,
        step:{
          ...state.step,
          project:Array.from(res.values())
        }
      }
    },
    mergeCommunity(state,{ payload }){
      let res=new Map();
      let source = state.step.community.concat(payload);
      source.forEach(item=>{

        res.set(JSON.stringify(item),item);
      });
      let community = Array.from(res.values())
      return {
        ...state,
        step:{
          ...state.step,
          community
        }
      }
    },
    removeModelsOptions(state,{payload}){
        const { index,currentModel } = payload
        let berforeData = {...state};
        berforeData.models[index] = currentModel;
        return berforeData
    },
    patchDatas(state,{ payload }){
      return {
        ...state,
        models:payload
      }
    },
    saveStep1Data(state, { payload }) {
      return {
        ...state,
        form: {
          ...payload,
        },
      };
    },
    addProjectName(state, { payload }) {
      let project = [...state.step.project, payload];
      project = Array.from(new Set(project))
      let step = { ...state.step, project };
      return   {
        ...state,
        step
      }
    },
  },
  communityName(state, { payload }) {
    let community = [...state.step.community, payload];
    community = Array.from(new Set(community))
    let step = { ...state.step, community };
    return {
      ...state,
      step,
    };
  },
};
