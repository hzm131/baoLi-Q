import {
  addcre,
  fetchBL,
  reject,
  findList,
} from '@/services/Cre';

export default {
  namespace: 'Cre',
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
    *addcre({ payload,callback }, { call, put }) {
      const response = yield call(addcre, payload);
      if (callback) callback(response);
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
