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
  };

  backClick = ()=>{
    router.push('/credit');
  }

  componentDidMount(){
    const { record } = this.props.location.state;
    const { dispatch } = this.props
    this.setState({
      initDate:record
    })

    //this.onRecord(record)
  }

  filemodal = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'Cre/findList',
      payload:{},
      callback:(res)=>{
        console.log('----res',res)
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

  render() {
    const {
      loading,
      dispatch,
      form: { getFieldDecorator },
    } = this.props;
    const { fileName } = this.state
    const description = (
      <DescriptionList >
       {/* <Description term="产品编号">
          <Tooltip title={this.state.initDate?this.state.initDate.productCode:''}>
            <p style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>{this.state.initDate?this.state.initDate.productCode:''}</p>
          </Tooltip>
        </Description>*/}
        <Description term="产品编号"><b>{this.state.initDate?this.state.initDate.productCode:''}</b></Description>
        <Description term="授信申请单号"><b>{this.state.initDate?this.state.initDate.creditApplyNo:''}</b></Description>
        <Description term="阿里客户"><b>{this.state.initDate?this.state.initDate.customerId:''}</b></Description>

        <Description term="公司名称"><b>{this.state.initDate?this.state.initDate.companyName:''}</b></Description>
        <Description term="枚举类型"><b>{this.state.initDate?this.state.initDate.companyLicenseType:''}</b></Description>
        <Description term="企业身份标识号码"><b>{this.state.initDate?this.state.initDate.companyLicenseNo:''}</b></Description>

        <Description term="法人姓名"><b>{this.state.initDate?this.state.initDate.legalPersonName:''}</b></Description>
        <Description term="法人证件类型"><b>{this.state.initDate?this.state.initDate.legalPersonLicenseType:''}</b></Description>
        <Description term="法人证件号码"><b>{this.state.initDate?this.state.initDate.legalPersonLicenseNo:''}</b></Description>

        <Description term="法人手机号">{this.state.initDate?this.state.initDate.legalPersonPhoneNo:''}</Description>
        <Description term="法人婚姻状态"><b>{this.state.initDate?this.state.initDate.legalPersonMaritalStatus:''}</b></Description>
        <Description term="法人配偶姓名"><b>{this.state.initDate?this.state.initDate.legalPersonMateName:''}</b></Description>

        <Description term="法人证件类型">{this.state.initDate?this.state.initDate.legalPersonMateLicenseType:''}</Description>
        <Description term="法人配偶证件号码"><b>{this.state.initDate?this.state.initDate.legalPersonMateLicenseNo:''}</b></Description>
        <Description term="联系人姓名"><b>{this.state.initDate?this.state.initDate.contactPersonName:''}</b></Description>

        <Description term="联系人手机号码">{this.state.initDate?this.state.initDate.contactPersonPhoneNo:''}</Description>
        <Description term="对公账户户名"><b>{this.state.initDate?this.state.initDate.publicAccountsName:''}</b></Description>
        <Description term="对公账户银行名字"><b>{this.state.initDate?this.state.initDate.publicAccountsBank:''}</b></Description>

        <Description term="对公账户开户支行">{this.state.initDate?this.state.initDate.publicAccountsBranchBank:''}</Description>
        <Description term="对公账户账号"><b>{this.state.initDate?this.state.initDate.publicAccountsNo:''}</b></Description>
        <Description term="平台注册时间"><b>{this.state.initDate?this.state.initDate.platformRegisteredTime:''}</b></Description>

        <Description term="年交易金额">{this.state.initDate?this.state.initDate.platformTransactionAmount1Year:''}</Description>
        <Description term="建议额度(单位:元)"><b>{this.state.initDate?this.state.initDate.adviceQuota:''}</b></Description>
        <Description term="建议单笔最高额度(单位:元)"><b>{this.state.initDate?this.state.initDate.loanLimitQuota:''}</b></Description>

        <Description term="平台累计回款金额(单位:元)"><b>{this.state.initDate?this.state.initDate.platformTotalPaymentCollectionAmount1Year:''}</b></Description>
        <Description term="平台年订单金额(单位:元)"><b>{this.state.initDate?this.state.initDate.platformOrderAmount1Year:''}</b></Description>
        <Description term="平台年结算单金额(单位:元)"><b>{this.state.initDate?this.state.initDate.platformSettlementAmount1Year:''}</b></Description>

        <Description term="平台年结算单笔数"><b>{this.state.initDate?this.state.initDate.platformSettlementNumber1Year:''}</b></Description>
        <Description term="建议额度(单位:元)"><b>{this.state.initDate?this.state.initDate.platformTotalSettlementAmountWithCoreCompany:''}</b></Description>
        <Description term="与核心企业的平台累计结算单金额(单位:元)"><b>{this.state.initDate?this.state.initDate.platformTotalSettlementAmountWithCoreCompany1Year:''}</b></Description>


      </DescriptionList>
    );
    const action = (
      <Fragment>
        {/*<Button type="primary" onClick={()=>this.lookAdvice()}>查看审批意见</Button>
        <Button type="primary" onClick={()=>this.onStatus()}>查看当前状态</Button>*/}
        <Button type="primary" onClick={this.reject}>审核</Button>
        <Button type="primary" onClick={this.backClick}>返回</Button>
        <Button type="primary" onClick={this.filemodal}>查看附件</Button>
        {/* <Button type="primary" onClick={this.filemContact}>查看合同详情</Button>*/}
      </Fragment>
    );
    const OnAddAgree = {
      onSave:(obj,clear)=>{
        console.log('---obj',obj)
        /*if(obj.uploadFile){
          const formData = new FormData();
          if(obj.uploadFile.fileList){
            obj.uploadFile.fileList.forEach((file)=>{
              formData.append('files[]', file.originFileObj?file.originFileObj:file);
              formData.append('type', 'business');
              formData.append('parentpath', 'invoice');
            })
          }
        }*/
        dispatch({
          type:'Cre/addcre',
          payload:obj,
          callback:(res)=>{
            console.log('000',res)
          }
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
      visible:this.state.agreeVisible
    }

    const OnAddReject = {
      onSave:(obj,clear)=>{
       dispatch({
         type:'Cre/reject',
         payload:obj,
         callback:(res)=>{
           alert(res.resData)
           clear()
           this.setState({
             rejectVisible:false

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
      visible:this.state.rejectVisible
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
        {/*  <Card title=''>
        <span>
                <Button type="primary" loading={ loading } onClick={()=>this.agree()}>同意</Button>
              </span>
          <span style={{marginLeft:14}}>
                <Button  style={{backgroundColor:'red',color:'#fff'}} loading={ loading } onClick={()=>this.reject()}>审核</Button>
              </span>
          <span style={{marginLeft:14}}>
                <Button  onClick={this.backClick}>返回</Button>
              </span>
        </Card>*/}
        <Modal
          title="点击下载"
          visible={this.state.fileShow}
          onCancel={this.fileCancel}
          width={"70%"}
          footer={null}
        >
          {/*<NormalTable
            columns={columns}
            data={{list:this.state.attachmentList}}
            loading={loading}
            pagination={false}
          />*/}
          <a target="_blank" href={fileName.url} download>{fileName.name}</a>
        </Modal>
        <CreditAgree on={OnAddAgree} data={OnAgreeData} />
        <CreditReject on={OnAddReject} data={OnRejectData} />
      </PageHeaderWrapper>
    );
  }
}

export default CreditInfo;
