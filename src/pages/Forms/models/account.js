import * as accountService from '../services/account';

export default {
  namespace: 'account',
  state: {
    all: {
      zc:  0,
      sr:  0,
    },
    month: {
      zc: 0,
      sr:  0,
    },
    date1: {
      zc: 0,
      sr: 0,
    },
    zc: {
      list: [],
      total: null,
      page: null,
    },
    sr: {
      list: [],
      total: null,
      page: null,
    },
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    save(state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, page };
    },
    zcsave(state, { payload: { data: list, total, page } }) {
      return { ...state, zc: { list, total, page }};
    },
    srsave(state, { payload: { data: list, total, page } }) {
      return { ...state, sr: { list, total, page }};
    },
    allSave(state, { payload: { all } }) {
      return { ...state, all };
    },
    monthSave(state, { payload: { month } }) {
      return { ...state, month };
    },
    dateSave(state, { payload: { date1 } }) {
      return { ...state, date1 };
    },
  },
  effects: {
    *fetch({ payload: { page = 1, type } }, { select, call, put }) {
      const { data } = yield call(accountService.fetch, { page, type });
      if (type == 'sr') {
        yield put({
          type: 'srsave',
          payload: {
            data: data['data'],
            total: data['total'],
            page: parseInt(page, 10),
          },
        });
      } else if (type == 'zc') {
        yield put({
          type: 'zcsave',
          payload: {
            data: data['data'],
            total: data['total'],
            page: parseInt(page, 10),
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            data: data['data'],
            total: data['total'],
            page: parseInt(page, 10),
          },
        });
      }
    },
    *all({ payload: { type } }, {call, put}) {

      const { data } = yield call(accountService.all, { type })

      if (type == 'all') {
        yield put({
          type: 'allSave',
          payload: {
            all: data,
          }
        })
      } else if (type == 'month') {
        yield put({
          type: 'monthSave',
          payload: {
            month: data,
          }
        })
      }
    },
    *date({payload: {begin, end} }, {call, put}) {

      const { data } = yield call(accountService.date, { begin, end })
      yield put({
        type: 'dateSave',
        payload: {
          date1: data,
        }
      })
    },
    *remove({ payload: id }, { call, put }) {
      yield call(accountService.remove, id);
      yield put({ type: 'reload' });
    },
    *patch({ payload: { id, values } }, { call, put }) {
      yield call(accountService.patch, id, values);
      yield put({ type: 'reload' });
    },

    *reload(action, { put, call,select }) {
      const page = yield select(state => state.account.page);
      yield put({ type: 'fetch', payload: { page } });
      yield put({ type: 'all', payload: { type: 'all' } });
      yield put({ type: 'all', payload: { type: 'month' } });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/form/basic-form') {
          dispatch({ type: 'fetch', payload: {...query, type: 'all'} });
        }
      });
    },
  },

};