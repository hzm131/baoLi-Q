import {
  queryLargeAmount,
  setAutoCredit
} from '@/services/auto';


export default {
  namespace: 'auto',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *queryLargeAmount({ payload,callback }, { call, put }) {
      const response = yield call(queryLargeAmount, payload);
      if (callback) callback(response);
    },
    *setAutoCredit({ payload,callback }, { call, put }) {
      const response = yield call(setAutoCredit, payload);
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
