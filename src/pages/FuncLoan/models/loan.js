import {
  addBL,
  fetchBL,
  reject,
  lookLoan,
  queryId
} from '@/services/loan';
import {
  fetchUcum,
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
    *queryId({ payload,callback }, { call, put }) {
      const response = yield call(queryId, payload);
      if (callback) callback(response);
    },
    *lookLoan({ payload,callback }, { call, put }) {
      const response = yield call(lookLoan, payload);
      console.log('-----response',response)
      let { pageIndex = 0 } = payload;
      let obj = [];
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id
          let obj = JSON.parse(item.extendInfo);
          item.fee = obj.fee?obj.fee:null
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }

      if (callback) callback(obj);
    },
    *fetchUcum({ payload,callback }, { call, put }) {
      const response = yield call(fetchUcum, payload);
      let obj = {};
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
          if(item.isAdmin === 1){
            item.authority2 = "全部权限"
          }else if(item.authority){
            const a = item.authority.split(",");
            const b = [];
            a.map(item =>{
              switch (item) {
                case 'creditQuery':
                  b.push("授信查看");
                  break;
                case 'loanQuery':
                  b.push("支用查看");
                  break;
                case 'creditAudit':
                  b.push("授信审核");
                  break;
                case 'loanAudit':
                  b.push("支用审核");
                  break;
              }
            });
            item.authority2 = b.join(',');
          }
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      if(callback) callback(obj)
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
      let obj = {}
      if(response.resData){
        let env = '';
        switch (process.env.API_ENV) {
          case 'test': //测试环境
            env = 'http://49.234.209.104:8080';
            break;
          case 'dev': //开发环境
            env = 'http://192.168.2.166:8080';
            break;
          case 'produce': //生产环境
            env = 'https://www.leapingtech.com/nienboot-0.0.1-SNAPSHOT';
            break;
        }
        response.resData.key = response.resData.id
        response.resData.uid = response.resData.id
        response.resData.url = env+response.resData.path;
        response.resData.thumbUrl = env+response.resData.path;

        /* response.resData.map(item =>{
           item.key = item.id;
           item.uid = item.id;
           //https://www.leapingtech.net/nien-0.0.1-SNAPSHOT
           item.url = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT'+item.path+'/'+item.name;
           item.thumbUrl = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT'+item.path+'/'+item.name;
           return item
         });*/
        obj = response.resData
      }
      if (callback) callback(obj);
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
