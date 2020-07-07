//股东信息
import {
  fetchList,
  fetchChild,
} from '@/services/perf';
import { fetchProject } from '@/services/PMA';

export default {
  namespace: 'perf',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      let obj = {
        list:[],
        pagination:{}
      }
      const { pageIndex } = payload;
      if(response.resData){
        //计算项目余额
        let arr = [];
        for(let i=0;i<response.resData.length;i++){
          let conditions = [{
            code:'PROJECT_ID',
            exp:'=',
            value:response.resData[i].projectId?response.resData[i].projectId:''
          },
            {
              code:'STATUS',
              exp:'=',
              value:'审批通过'
            }
          ];
          const childresponse = yield call(fetchChild, {conditions});
          console.log('childresponse',childresponse)
          if(childresponse.resData){
            arr = arr.concat(childresponse.resData)
          }
        }
        response.resData = response.resData.map((item)=>{
          item.key = item.id;
          let arrCount = [];
          arr.forEach((value)=>{
            if(item.projectId === value.projectId){
              arrCount.push(value)
            }
          });
          let ndef1 = item.ndef1;
          if(ndef1){
            if(arrCount.length > ndef1){
              let count = 0;
              for(let i = ndef1;i<arrCount.length;i++){
                count = count + arrCount[i].travelfee;
              }
              item.leftfeeend = item.projectmoney - count - item.totalsubsidy;
            }else{
              item.leftfeeend = item.projectmoney  - item.totalsubsidy;
            }
          }
          return item
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      console.log("obj",obj)
      yield put({
        type: 'save',
        payload: obj
      });
      if (callback) callback(obj);
    },
    *fetchProject({ payload,callback }, { call, put }) {
      const response = yield call(fetchProject, payload);
      const { pageIndex } = payload;
      let obj = [];
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
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
    *fetchChild({ payload,callback }, { call, put }) {
      const response = yield call(fetchChild, payload);
      if (callback) callback(response);
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

  },
};
