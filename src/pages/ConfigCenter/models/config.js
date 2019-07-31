import { addFeesConfigModel,getCurrentAllData,updateConfig,deleteConfig } from '@/services/api';
export default {
  namespace: 'config',

  state: {
    models:[]
  },

  effects: {
    *chargeConfig({ payload,callback},{ call, put}){
      console.log(payload)
      if (payload.id) {
        yield put({
          type:"updateConfig",
          payload,
          callback:()=>{
            callback()
          }
        })
        return
      }
      try {

        const response = yield call(addFeesConfigModel,payload);
        const { afixFees,computedFees } = payload
        if (response.code === 1) {
          yield put({
            type:"addCurrentData",
            payload:{response:response.data,model:{afixFees,computedFees}}
          })
        }
        callback(response.data);

      } catch (e) {
        console.log(e)
      } finally {

      }

    },
    *configDelete({payload},{call,put}){
      //index
      const { index,data,id} = payload;
      try {
        const response = yield call(deleteConfig,{id})
        yield put({
          type:"updateCurrentState",
          payload:id
        })
      } catch (error) {
          const { response = {} } = error;
      } finally {

      }

    },
    *updateConfig({ payload ,callback},{ call, put}){
      try {
        const { index, ...res} = payload
        const response = yield call(updateConfig,res);
        if (response.code === 1) {
          yield put({
            type:"updateData",
            payload
          })
        }
        callback()
      } catch (e) {

      }

    },
    *getCurrentModels(_,{ call , put}){
      const response = yield call(getCurrentAllData);
      yield put({
        type:"patchDatas",
        payload:response.data.data.map((val,index)=>Object.assign({},val,{model:JSON.parse(val.model)}))
      })
    }
  },

  reducers: {
    updateData(state,{payload}){
      const index = payload.index;
      delete payload.index;
      const { id,modelName,...rest}=payload;
      const uid = state.models[index].uid;

      const newState = {
          uid,
          id,
          modelName,
          model:rest
      }
      let temp = {...state};
      temp.models[index] = newState;
      return temp
    },
    updateCurrentState(state,{payload}){
      return {
        ...state,
        models:state.models.filter(val=>val.id!==payload)
      }
    },
    addCurrentData(state,{ payload }){
      console.log(state,payload)
      const { response, model} = payload;
      response.model = model;
      const models = [...state.models,response];
      return {
        ...state,
        models
      }
    },
    patchDatas(state,{ payload }){

      return {
        ...state,
        models:payload
      }
    }
  }
};
