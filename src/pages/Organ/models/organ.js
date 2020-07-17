import {
  addBL,
  findLoan,
  updateOrgan,
} from '@/services/organ';


export default {
  namespace: 'organ',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchBL, payload);
      let { pageIndex = 0 } = payload;
      let obj = [];
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }

      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addBL, payload);
      if (callback) callback();
    },
    *findLoan({ payload,callback }, { call, put }) {
      const response = yield call(findLoan, payload);
      if (callback) callback(response);
    },
    *updateOrgan({ payload,callback }, { call, put }) {
      const response = yield call(updateOrgan, payload);
      if (callback) callback(response);
    },
    *reject({ payload,callback }, { call, put }) {
      const response = yield call(reject, payload);
      if (callback) callback(response);
    },

  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    }
  },
};
