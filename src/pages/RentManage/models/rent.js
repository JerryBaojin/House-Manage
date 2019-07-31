import { getCommunityById, getCommunityAll,removeFile ,addRenter ,addPreOrder, getOrder, updateOrder} from '@/services/api';
import { notification } from 'antd';
export default {
  namespace: 'rent',

  state: {
    uploadUrl:APP_U,
    data:{
      ext:[]
    },
    form:{

    }
  },

  effects: {
    *_updateOrder({ payload },{ call, put}){
      try {
        const response = yield call(updateOrder,payload);
        if (response.code ===1 ) {
          notification.success({
            message:response.info
          });
        }
      } catch (e) {

      } finally {

      }
    },
    *initDataForm(_, { put }){
      yield put({
        type:"initData"
      })
    },
    *submitPreOrderForm({ payload },{ call, put}){
      try {
        const response = yield call(addPreOrder,payload);
        if (response.code ===1 ) {
          notification.success({
            message:response.info
          });
        }
      } catch (e) {

      }

    },
    *submitForm({ payload },{ call, put}){
      try {
        const response = yield call(addRenter,payload);
        if (response.code ===1 ) {
          notification.success({
            message:response.info
          });
        }
      } catch (e) {

      }

    },
    *_removeFile({ payload },{ call, put}){
       yield call(removeFile,payload);
    },
    *_handleChooseHouseId({ payload },{ call, put }){
      const response = yield call(getCommunityById,payload);
      if (response.data.length === 0) {
        notification.error({
          message:'请输入正确的唯一ID'
        });
      }else{
        if(typeof response.data[0].fees ==='string'){
          yield put({
            type:"settingCurrentModel",
            payload:response.data[0]
          })
        }

      }

    },
    *asyncExtParams({ payload },{ call,put }){
      yield put({
        type:"handleAsyncData",
        payload
      })
    },
    *getPreOrderInfo({ payload ,callback },{ call,put }){
      try {
        const response = yield call(getOrder,payload);
        if (response.code ===1 ) {
          const { houseData , preOrderInfo } = response.data;
          houseData.fees ={
            afixFees:JSON.parse(preOrderInfo.afixFees),
            computedFees:JSON.parse(preOrderInfo.computedFees)
          }
          yield put({
            type:"saveDatas",
            payload:{ houseData , preOrderInfo }
          })
        }
      } catch (e) {
        notification.error({
          message:e.message
        })
      } finally {
        callback()
      }


    },
    *getHouse( _, { call, put }){
      const response = yield call(getCommunityAll);
      yield put({
        type:"saveCommunitys",
        payload:response.data
      })
    }
  },

  reducers: {
    initData(state){
      return {
        uploadUrl:"http://localhost/api/upload",
        data:{
          ext:[]
        },
        form:{}
      }
    },
    settingCurrentModel(state, { payload }){
    //  const data = state.originData.filter(val=>val.id === payload )[0];
    try {
        payload.fees = JSON.parse(payload.fees);
        return {
          ...state,
          data:payload
        }
    } catch (e) {
      console.log(e);
    } 


    },
    saveDatas(state,{ payload }){
        const { houseData , preOrderInfo } = payload;
      return {
        ...state,
        data:houseData,
        form:preOrderInfo
      }
    },
    saveCommunitys(state ,{ payload } ){
      return {
        ...state,
        originData:payload
      }
    },

    handleAsyncData(state , { payload }){
      const a =Array.from(new Set([...state.data.ext,payload]));
      return {
        ...state,
        data:{
          ...state.data,
          ext:a
        }
      }
    }
  },
};
