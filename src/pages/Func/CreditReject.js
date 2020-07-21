import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  DatePicker,
  Form,
  Input,
  Checkbox,
  TreeSelect,
} from 'antd';


const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ Cre,loading }) => ({
  Cre,
  loading:loading.models.Cre
}))
@Form.create()
class CreditReject extends PureComponent {
  state = {
    BStatus:false,
    pageStore:{},
  };

  onSave = (onSave)=>{
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      form,
    } = this.props;
    const { visible,record } = data;
    console.log('---record',record)
    const { BStatus, } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const en = {
        customerId:values.customerId,
        loanLimitQuota:values.loanLimitQuota
      }

      const obj = {
        reqData:{
          ...values,
          endDate:values.endDate?(values.endDate).format('YYYY-MM-DD HH:mm:ss'):null,
          startDate:values.startDate?(values.startDate).format('YYYY-MM-DD HH:mm:ss'):null,
          eventTime:values.eventTime?(values.eventTime).format('YYYY-MM-DD HH:mm:ss'):null,
          failReasonCode:values.code?values.code:null,
          quotaAmount:(Number(values.quotaAmount).toFixed(2)).toString(),
          failReasonMessage:values.message?values.message:null,
          extendInfo:JSON.stringify(en),
          creditId:record.id,
          channel:'SHNF',
        }

      };
      this.setState({
        BStatus:true
      })
      if(typeof onSave === 'function'){
        onSave(obj,this.clear);
      }
    })
  };

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  };

  clear = (status)=> {
    if(status){
      this.setState({
        BStatus:false
      })
      return
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      BStatus:false,
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      on
    } = this.props;

    const { visible,record } = data;
    const { onSave,onCancel } = on;

    return (
      <Modal
        title={"审核"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='机构授信编号'>
              {getFieldDecorator('institutionCreditNo',{
                rules: [{
                  required: true,
                  message:'机构授信编号'
                }]
              })(
                <Input placeholder="请输入机构授信编号"/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="授信状态">
              {getFieldDecorator('status',{
                rules: [{
                  required: true,
                  message:'授信状态'
                }]
              })(<Select  style={{ width: '100%' }} placeholder={'请选择状态'}>
                  <Option value="QUALIFIED">授信成功</Option>
                  <Option value="REJECTED">授信拒绝</Option>
              </Select>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="事件发生时间">
              {getFieldDecorator('eventTime',{
                rules: [{
                  required: true,
                  message:'事件发生时间'
                }]
              })( <DatePicker showTime style={{width:'100%'}} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='对接渠道'>
              {getFieldDecorator('channel',{
                initialValue:'上海国立商业保理'
                // rules: [{
                //   required: true,
                //   message:'对接渠道'
                // }]
              })(
                <Input placeholder="请输入对接渠道" disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="授信额度金额(单位：元)">
              {getFieldDecorator('quotaAmount',{
                rules: [{
                  required: true,
                  message:'授信额度金额'
                }]
              })( <Input placeholder="请输入授信额度金额" />)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="授信期限">
              {getFieldDecorator('creditTerm',{
              })( <Input placeholder="请输入授信期限" type={'number'}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='授信期限单位'>
              {getFieldDecorator('creditTermUnit',{
              })(
                <Select  style={{ width: '100%' }} placeholder={'请选择授信期限单位'}>
                <Option value="Y">年</Option>
                <Option value="M">月</Option>
                <Option value="D">日</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="授信有效期开始日">
              {getFieldDecorator('startDate',{
              })( <DatePicker showTime style={{width:'100%'}} />)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="授信有效期结束日">
              {getFieldDecorator('endDate',{
              })(<DatePicker showTime  style={{width:'100%'}} />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='单笔支用限额（单位：元）'>
              {getFieldDecorator('loanLimitQuota',{
                rules: [{
                  required: true,
                  message:'单笔支用限额'
                }]
              })(
                <Input placeholder="请输入单笔支用限额"/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='阿里授信申请单号'>
              {getFieldDecorator('creditApplyNo',{
                initialValue:record.creditApplyNo,
                rules: [{
                  required: true,
                  message:'阿里授信申请单号'
                }]
              })(
                <Input placeholder="请输入阿里授信申请单号" disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='阿里客户'>
              {getFieldDecorator('customerId',{
                rules: [{
                  required: true,
                  message:'阿里客户'
                }]
              })(
                <Input placeholder="请输入阿里客户"/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='拒绝原因码'>
              {getFieldDecorator('code',{
              })(
                <Input placeholder="拒绝原因码(字数限制:64位)" maxLength={64}/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>

          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>

          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={24} md={24} sm={24}>
            <Form.Item label="拒绝原因描述">
              {getFieldDecorator('message', {
              })(<TextArea rows={4} placeholder={'拒绝原因描述(字数限制:256位)'} maxLength={256}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default CreditReject;

