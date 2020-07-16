import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import storage from '@/utils/storage'

import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Divider,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
  message,
  Transfer, Badge, Dropdown, Steps, List,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import NormalTable from '@/components/NormalTable';
import LoanAgree from './LoanAgree';
import LoanReject from './LoanReject';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Description } = DescriptionList;
const { TextArea } = Input;
const ButtonGroup = Button.Group;
const { Step } = Steps;
@connect(({ Cre, loading }) => ({
  Cre,
  loading: loading.models.Cre,
}))
@Form.create()
class CreditInfo extends PureComponent {
  state = {
    fileList:[],
    tableList:[],
    attachmentsList:[],
    fileShow:false,
    finaceok:true,
    initDate:{},
    current:1,
    agreeVisible:false,
    rejectVisible:false,
    fileName:{},
    loanApplyNo:'',
    attaType:['jpg','png','jpeg'],
    checkStatus:false
  };

  backClick = ()=>{
    router.push('/loan/list');
  }

  componentDidMount(){
    const { record } = this.props.location.state;
    const { attas } = record;
    const { dispatch } = this.props
    const attachmentsList = JSON.parse(attas)
    console.log("record",record)
    this.setState({
      initDate:record,
      loanApplyNo:record.loanApplyNo,
      attachmentsList
    })
    if(record.status){
      this.setState({
        checkStatus:true
      })
    }
    //this.onRecord(record)
  }

  filemodal = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'loan/findList',
      payload:{},
      callback:(res)=>{
        this.setState({
          fileName:res,
          fileShow: true
        })
      }
    })
  }

  fileCancel = ()=>{
    this.setState({
      fileShow: false
    })
  }

  onCancel = ()=>{
    this.setState({
      contactModal:false
    })
  };

  agree = ()=>{
    this.setState({
      agreeVisible:true
    })
  }

  reject = ()=>{
    this.setState({
      rejectVisible:true
    })
  }

  onLook = ()=>{
    const { dispatch } = this.props
    const { initDate } = this.state
    this.setState({
      agreeVisible:true
    })
    dispatch({
      type:'loan/lookLoan',
      payload:{
        conditions:[{
          code:'loan_id',
          exp:'=',
          value:initDate.id
        }],
        pageIndex:0,
        pageSize:100000,
      },
      callback:(res)=>{
        console.log('返回',res)
        if(res.list){
          this.setState({
            tableList:res.list
          })
        }
      }
    })

  }

  render() {
    const {
      loading,
      dispatch,
      form: { getFieldDecorator },
    } = this.props;
    const { fileName,loanApplyNo,attaType,initDate,tableList,attachmentsList } = this.state

    const description = (
      <DescriptionList >
       {/* <Description term="产品编号">
          <Tooltip title={this.state.initDate?this.state.initDate.productCode:''}>
            <p style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>{this.state.initDate?this.state.initDate.productCode:''}</p>
          </Tooltip>
        </Description>*/}
        <Description term="贷款申请编号">
          <Tooltip title={this.state.initDate?this.state.initDate.loanApplyNo:''}>
            <p style={{fontWeight:'900',width:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.loanApplyNo:''}
            </p>
          </Tooltip>
        </Description>
        <Description term="贷款合同编号">
          <Tooltip title={this.state.initDate?this.state.initDate.loanNo:''}>
            <p style={{fontWeight:'900',width:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.loanNo:''}
            </p>
          </Tooltip>
        </Description>
        <Description term="阿里客户"><b>{this.state.initDate?this.state.initDate.customerId:''}</b></Description>

        <Description term="贷款产品编号">
          <Tooltip title={this.state.initDate?this.state.initDate.loanProductCode:''}>
            <p style={{fontWeight:'900',width:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.loanProductCode:''}
            </p>
          </Tooltip>
        </Description>
        <Description term="交易货品名称">
          <Tooltip title={this.state.initDate?this.state.initDate.saleProductName:''}>
            <p style={{fontWeight:'900',width:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.saleProductName:''}
            </p>
          </Tooltip>
        </Description>
        <Description term="收货时间"><b>{this.state.initDate?this.state.initDate.productReceiveTime:''}</b></Description>

        <Description term="订单生成时间"><b>{this.state.initDate?this.state.initDate.orderCreateTime:''}</b></Description>
        <Description term="结算单金额(单位:元)"><b>{this.state.initDate?this.state.initDate.statementAmount:''}</b></Description>
        <Description term="订单付款日期"><b>{this.state.initDate?this.state.initDate.orderPaymentTime:''}</b></Description>

        <Description term="物流单号">
          <Tooltip title={this.state.initDate?this.state.initDate.logisticsNumber:''}>
            <p style={{fontWeight:'900',width:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.logisticsNumber:''}
            </p>
          </Tooltip>
        </Description>
        <Description term="结算单付款日期"><b>{this.state.initDate?this.state.initDate.statementPaymentTime:''}</b></Description>
        <Description term="申请放款时间"><b>{this.state.initDate?this.state.initDate.loanApplyTime:''}</b></Description>

        <Description term="申请放款金额(单位:元)"><b>{this.state.initDate?this.state.initDate.loanAmount:''}</b></Description>
        <Description term="法人配偶证件号码">
          <Tooltip title={this.state.initDate?this.state.initDate.legalPersonMateLicenseNo:''}>
            <p style={{fontWeight:'900',width:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.legalPersonMateLicenseNo:''}
            </p>
          </Tooltip>
        </Description>
        <Description term="执行年化费率"><b>{this.state.initDate?this.state.initDate.rate:''}</b></Description>

      </DescriptionList>
    );
    const action = (
      <Fragment>

        <Button type="primary" onClick={this.reject}>审核</Button>
        <Button type="primary" onClick={this.filemodal}>查看附件</Button>
        <Button type="primary" onClick={this.onLook}>查看结果</Button>
        <Button type="primary" onClick={this.backClick}>返回</Button>
        {/* <Button type="primary" onClick={this.filemContact}>查看合同详情</Button>*/}
      </Fragment>
    );

    const OnAddAgree = {
      onSave:(clear)=>{
        clear();
        this.setState({
          agreeVisible:false
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          agreeVisible:false
        })
      }
    }
    const OnAgreeData = {
      visible:this.state.agreeVisible,
      record:tableList,
    }

    const OnAddReject = {
      onSave:(obj,clear)=>{
        console.log('---obj',obj)
        dispatch({
          type:'loan/reject',
          payload:obj,
          callback:(res)=>{
            console.log('---返回',res)
            alert(res.resData)
            clear()
            this.setState({
              rejectVisible:false,
              checkStatus:true
            })
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          rejectVisible:false
          //

        })
      }
    }
    const OnRejectData = {
      visible:this.state.rejectVisible,
      record:initDate,
    }

    let env = '';
    switch (process.env.API_ENV) {
      case 'test': //测试环境
        env = 'http://49.234.209.104:8080';
        break;
      case 'dev': //开发环境
        //env = 'http://127.0.0.1:8080';
        env = 'http://192.168.2.166:8080';
        break;
      case 'produce': //生产环境
        env = 'https://www.leapingtech.com/nienboot-0.0.1-SNAPSHOT';
        break;
    }
    return (
      <PageHeaderWrapper
        title='详情'
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description}
        /*extraContent={}*/
        onTabChange={this.onOperationTabChange}
      >

        <Modal
          title="附件"
          visible={this.state.fileShow}
          onCancel={this.fileCancel}
          width={"70%"}
          footer={null}
        >
          <List
            size='small'
            style={{marginTop:'20px'}}
            dataSource={attachmentsList}
            pagination={{
              onChange: page => {
                this.setState({
                  current:page
                })
              },
              pageSize:1,
              current:this.state.current ,
              total:attachmentsList.length
            }}
            renderItem={item => {
              return <List.Item>
                <Card>
                  <div>
                    {
                      attaType.indexOf(item.suffix) !== -1?<img src={`${env}/static/${item.name}`}/>:<a target="_blank" href={`${env}/static/${item.name}`} download>{item.name}</a>
                    }
                  </div>
                </Card>
              </List.Item>
            }}
          />
        </Modal>
        <LoanAgree on={OnAddAgree} data={OnAgreeData} />
        <LoanReject on={OnAddReject} data={OnRejectData} />
      </PageHeaderWrapper>
    );
  }
}

export default CreditInfo;
