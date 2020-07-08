import {
  addBL,
  fetchBL,
  reject,
} from '@/services/loan';
import {
  findList,
} from '@/services/Cre';

export default {
  namespace: 'loan',
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
    *reject({ payload,callback }, { call, put }) {
      const response = yield call(reject, payload);
      if (callback) callback(response);
    },
    *findList({ payload,callback }, { call, put }) {
      const response = yield call(findList, payload);
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
