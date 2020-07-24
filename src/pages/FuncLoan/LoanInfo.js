import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';

import {
  Form,
  Button,
  Tooltip,
  Modal,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import NormalTable from '@/components/NormalTable';
import LoanAgree from './LoanAgree';
import LoanReject from './LoanReject';
import env from '../../../config/env';

const { Description } = DescriptionList;

@connect(({ loan, loading }) => ({
  loan,
  loading: loading.models.loan,
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
    const { dispatch } = this.props;
    const { id = 0 } = this.props.match.params;
    dispatch({
      type:'loan/queryId',
      payload:{
        conditions:[{code:'id',exp:"=",value:id}]
      },
      callback:(res)=>{
        console.log("res",res)
        if(res.errMsg === "成功" && res.resData && res.resData.length){
          const  record  = res.resData[0];
          const { attas } = record;
          const attachmentsList = JSON.parse(attas)
          attachmentsList.map((item,index)=>{
            item.key = index
          })

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
        }
      }
    })
    /*const { record } = this.props.location.state;
    const { attas } = record;
    const attachmentsList = JSON.parse(attas)
    attachmentsList.map((item,index)=>{
      item.key = index
    })

    this.setState({
      initDate:record,
      loanApplyNo:record.loanApplyNo,
      attachmentsList
    })
    if(record.status){
      this.setState({
        checkStatus:true
      })
    }*/
  }

  filemodal = ()=>{
    this.setState({
      fileShow: true
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
    const { fileName,loanApplyNo,attaType,initDate,tableList,attachmentsList,checkStatus } = this.state

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
        <Description term="公司名称">
          <Tooltip title={this.state.initDate?this.state.initDate.companyName:''}>
          <p style={{fontWeight:'900',width:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
            {this.state.initDate?this.state.initDate.companyName:''}
          </p>
        </Tooltip>
        </Description>

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
        <Button type="primary" onClick={this.reject} disabled={checkStatus}>审核</Button>
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
        dispatch({
          type:'loan/reject',
          payload:obj,
          callback:(res)=>{
            if(res.errCode === 200){
              message.success(`成功-${res.resData}`,1.5,()=>{
                clear()
                this.setState({
                  checkStatus:true,
                  rejectVisible:false
                })
              })
            }else{
              message.error(`失败-${res.errMsg}`,1.5,()=>{
                clear(1)
                this.setState({
                  checkStatus:false
                })
              })
            }
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

    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        render: (text)=>{
          return text + 1
        }
      },
      {
        title: '附件类型',
        dataIndex: 'type',
        render:((text,record)=>{
          switch (text) {
            case 'QCBL_INVISIBLE_FACTOR_CONTRACT_AGREEMENT':
              return '保理协议（暗保）';
            case 'QCBL_LEGAL_GUARANTEE_CONTRACT_AGREEMENT':
              return '法人担保协议';
            case 'QCBL_SPOUSE_GUARANTEE_CONTRACT_AGREEMENT':
              return '配偶担保协议';
            case 'QCBL_LOAN_CONFIRMATION_AGREEMENT':
              return '放款确认书';
            default :
              return text;
          }
        })
      },
      {
        title: '附件名称',
        dataIndex:'name',
        render: (text, record) => (
          <a target="_blank" href={`${env}/static/file/${text}`} download>{text}</a>        ),
      },
      {
        title: '',
        dataIndex:'caozuo',
        width:1
      }
    ];



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
          <NormalTable
            columns={columns}
            dataSource={attachmentsList}
            loading={loading}
            pagination={false}
          />
        </Modal>
        <LoanAgree on={OnAddAgree} data={OnAgreeData} />
        <LoanReject on={OnAddReject} data={OnRejectData} />
      </PageHeaderWrapper>
    );
  }
}

export default CreditInfo;
