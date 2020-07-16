import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import storage from '@/utils/storage'
import {
  Row,
  Col,
  List,
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
  Transfer, Badge, Dropdown, Steps,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import NormalTable from '@/components/NormalTable';
import CreditAgree from './CreditAgree';
import CreditReject from './CreditReject';

const { Description } = DescriptionList;

@connect(({ Cre, loading }) => ({
  Cre,
  loading: loading.models.Cre,
}))
@Form.create()
class CreditInfo extends PureComponent {
  state = {
    fileList:[],
    fileShow:false,
    finaceok:true,
    initDate:{},
    agreeVisible:false,
    rejectVisible:false,
    fileName:{},
    creditApplyNo:'',
    tableList:[],
    current:1,
    attachmentsList:[],
    attaType:['jpg','png','jpeg'],
    checkStatus:false,
  };

  backClick = ()=>{
    router.push('/credit');
  }

  componentDidMount(){
    const { record } = this.props.location.state;
    const { attas } = record;
    const { dispatch } = this.props
    const attachmentsList = JSON.parse(attas)
    this.setState({
      initDate:record,
      creditApplyNo:record.creditApplyNo,
      attachmentsList,
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
  /*  dispatch({
      type:'Cre/findList',
      payload:{},
      callback:(res)=>{
        console.log('----res',res)
        this.setState({
          fileName:res,
          fileShow: true
        })
      }
    })*/
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
      type:'Cre/lookTable',
      payload:{
        conditions:[{
          code:'credit_id',
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
    const { fileName,tableList,attachmentsList,attaType,checkStatus } = this.state
    const description = (
      <DescriptionList >
       {/* <Description term="产品编号">
          <Tooltip title={this.state.initDate?this.state.initDate.productCode:''}>
            <p style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>{this.state.initDate?this.state.initDate.productCode:''}</p>
          </Tooltip>
        </Description>*/}
        <Description term="产品编号"><b>{this.state.initDate?this.state.initDate.productCode:''}</b></Description>
        <Description term="授信申请单号">
          <Tooltip title={this.state.initDate?this.state.initDate.creditApplyNo:''}>
            <p style={{fontWeight:'900',width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.creditApplyNo:''}
            </p>
          </Tooltip>

        </Description>
        <Description term="阿里客户"><b>{this.state.initDate?this.state.initDate.customerId:''}</b></Description>

        <Description term="公司名称"><b>{this.state.initDate?this.state.initDate.companyName:''}</b></Description>
        <Description term="枚举类型"><b>{this.state.initDate?this.state.initDate.companyLicenseType:''}</b></Description>
        <Description term="企业身份标识号码"><b>{this.state.initDate?this.state.initDate.companyLicenseNo:''}</b></Description>

        <Description term="法人姓名"><b>{this.state.initDate?this.state.initDate.legalPersonName:''}</b></Description>
        <Description term="法人证件类型"><b>{this.state.initDate?this.state.initDate.legalPersonLicenseType:''}</b></Description>
        <Description term="法人证件号码"><b>
          <Tooltip title={this.state.initDate?this.state.initDate.legalPersonLicenseNo:''}>
            <p style={{fontWeight:'900',width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.legalPersonLicenseNo:''}
            </p>
          </Tooltip>
        </b></Description>

        <Description term="法人手机号"><b>{this.state.initDate?this.state.initDate.legalPersonPhoneNo:''}</b></Description>
        <Description term="法人婚姻状态"><b>{this.state.initDate?this.state.initDate.legalPersonMaritalStatus:''}</b></Description>
        <Description term="法人配偶姓名"><b>{this.state.initDate?this.state.initDate.legalPersonMateName:''}</b></Description>

        <Description term="法人证件类型"><b>{this.state.initDate?this.state.initDate.legalPersonMateLicenseType:''}</b></Description>
        <Description term="法人配偶证件号码">
          <Tooltip title={this.state.initDate?this.state.initDate.legalPersonMateLicenseNo:''}>
            <p style={{fontWeight:'900',width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.legalPersonMateLicenseNo:''}
            </p>
          </Tooltip>
        </Description>
        <Description term="联系人姓名"><b>{this.state.initDate?this.state.initDate.contactPersonName:''}</b></Description>

        <Description term="联系人手机号码"><b>{this.state.initDate?this.state.initDate.contactPersonPhoneNo:''}</b></Description>
        <Description term="对公账户户名"><b>{this.state.initDate?this.state.initDate.publicAccountsName:''}</b></Description>
        <Description term="对公账户银行名字">
          <Tooltip title={this.state.initDate?this.state.initDate.publicAccountsBank:''}>
            <p style={{fontWeight:'900',width:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.publicAccountsBank:''}
            </p>
          </Tooltip>
        </Description>

        <Description term="对公账户开户支行">
          <Tooltip title={this.state.initDate?this.state.initDate.publicAccountsBranchBank:''}>
            <p style={{fontWeight:'900',width:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.publicAccountsBranchBank:''}
            </p>
          </Tooltip>
        </Description>
        <Description term="对公账户账号">
          <Tooltip title={this.state.initDate?this.state.initDate.publicAccountsNo:''}>
            <p style={{fontWeight:'900',width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.publicAccountsNo:''}
            </p>
          </Tooltip>
        </Description>
        <Description term="平台注册时间"><b>{this.state.initDate?this.state.initDate.platformRegisteredTime:''}</b></Description>

        <Description term="年交易金额"><b>{this.state.initDate?this.state.initDate.platformTransactionAmount1Year:''}</b></Description>
        <Description term="建议额度(单位:元)"><b>{this.state.initDate?this.state.initDate.adviceQuota:''}</b></Description>
        <Description term="建议单笔最高额度(单位:元)"><b>{this.state.initDate?this.state.initDate.loanLimitQuota:''}</b></Description>

        <Description term="平台累计回款金额(单位:元)"><b>{this.state.initDate?this.state.initDate.platformTotalPaymentCollectionAmount1Year:''}</b></Description>
        <Description term="平台年订单金额(单位:元)"><b>{this.state.initDate?this.state.initDate.platformOrderAmount1Year:''}</b></Description>
        <Description term="与核心企业的平台累计结算单金额(单位:元)">
          <Tooltip title={this.state.initDate?this.state.initDate.platformTotalSettlementAmountWithCoreCompany1Year:''}>
            <p style={{fontWeight:'900',width:'50px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.platformTotalSettlementAmountWithCoreCompany1Year:''}
            </p>
          </Tooltip>
        </Description>

        <Description term="平台年结算单笔数"><b>{this.state.initDate?this.state.initDate.platformSettlementNumber1Year:''}</b></Description>
        <Description term="平台年结算单金额(单位:元)"><b>{this.state.initDate?this.state.initDate.platformSettlementAmount1Year:''}</b></Description>
        <Description term="与核企（准入买家）的年回款金额">
          <Tooltip title={this.state.initDate?this.state.initDate.platformPaymentCollectionAmountWithCoreCompany1Year:''}>
            <p style={{fontWeight:'900',width:'100px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.platformPaymentCollectionAmountWithCoreCompany1Year:''}
            </p>
          </Tooltip>
        </Description>

        <Description term="与核企（准入买家）的年结算单笔数"><b>{this.state.initDate?this.state.initDate.platformSettlementNumberWithCoreCompany1Year:''}</b></Description>
      </DescriptionList>
    );
    const action = (
      <Fragment>
        {/*<Button type="primary" onClick={()=>this.lookAdvice()}>查看审批意见</Button>*/}
        <Button type="primary" onClick={this.reject} disabled={checkStatus}>审核</Button>
        <Button type="primary" onClick={this.filemodal}>查看附件</Button>
        <Button type="primary" onClick={this.onLook}>查看结果</Button>
        <Button type="primary" onClick={this.backClick}>返回</Button>
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
      record:tableList
    }

    const OnAddReject = {
      onSave:(obj,clear)=>{
       console.log('提交数据',obj)
       dispatch({
         type:'Cre/reject',
         payload:obj,
         callback:(res)=>{
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
      record:this.state.initDate,
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
          {/*{
            attachmentsList.map(item=>{
              if(attaType.indexOf(item.suffix) !== -1){
                return <img src={`${env}/static/${item.name}`}/>
              }else {
                return <a target="_blank" href={`${env}/static/${item.name}`} download>{item.name}</a>
              }

            })
          }*/}
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
        <CreditAgree on={OnAddAgree} data={OnAgreeData} />
        <CreditReject on={OnAddReject} data={OnRejectData} />
      </PageHeaderWrapper>
    );
  }
}

export default CreditInfo;
