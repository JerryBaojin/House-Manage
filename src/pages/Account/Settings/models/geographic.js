import { queryProvince, queryCity } from '@/services/geographic';

export default {
  namespace: 'geographic',

  state: {
    province: [],
    city: [],
    isLoading: false,
  },

  effects: {
    *fetchProvince(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = [{"name":"北京市","id":"110000"},{"name":"天津市","id":"120000"},{"name":"河北省","id":"130000"},{"name":"山西省","id":"140000"},{"name":"内蒙古自治区","id":"150000"},{"name":"辽宁省","id":"210000"},{"name":"吉林省","id":"220000"},{"name":"黑龙江省","id":"230000"},{"name":"上海市","id":"310000"},{"name":"江苏省","id":"320000"},{"name":"浙江省","id":"330000"},{"name":"安徽省","id":"340000"},{"name":"福建省","id":"350000"},{"name":"江西省","id":"360000"},{"name":"山东省","id":"370000"},{"name":"河南省","id":"410000"},{"name":"湖北省","id":"420000"},{"name":"湖南省","id":"430000"},{"name":"广东省","id":"440000"},{"name":"广西壮族自治区","id":"450000"},{"name":"海南省","id":"460000"},{"name":"重庆市","id":"500000"},{"name":"四川省","id":"510000"},{"name":"贵州省","id":"520000"},{"name":"云南省","id":"530000"},{"name":"西藏自治区","id":"540000"},{"name":"陕西省","id":"610000"},{"name":"甘肃省","id":"620000"},{"name":"青海省","id":"630000"},{"name":"宁夏回族自治区","id":"640000"},{"name":"新疆维吾尔自治区","id":"650000"},{"name":"台湾省","id":"710000"},{"name":"香港特别行政区","id":"810000"},{"name":"澳门特别行政区","id":"820000"}];
      yield put({
        type: 'setProvince',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchCity({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = [{"province":"浙江省","name":"杭州市","id":"330100"},{"province":"浙江省","name":"宁波市","id":"330200"},{"province":"浙江省","name":"温州市","id":"330300"},{"province":"浙江省","name":"嘉兴市","id":"330400"},{"province":"浙江省","name":"湖州市","id":"330500"},{"province":"浙江省","name":"绍兴市","id":"330600"},{"province":"浙江省","name":"金华市","id":"330700"},{"province":"浙江省","name":"衢州市","id":"330800"},{"province":"浙江省","name":"舟山市","id":"330900"},{"province":"浙江省","name":"台州市","id":"331000"},{"province":"浙江省","name":"丽水市","id":"331100"}];
      yield put({
        type: 'setCity',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    setProvince(state, action) {
      return {
        ...state,
        province: action.payload,
      };
    },
    setCity(state, action) {
      return {
        ...state,
        city: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
  },
};
