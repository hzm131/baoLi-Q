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
  InputNumber,
  TreeSelect,
} from 'antd';

import moment from 'moment';
import  { getDaysBetween }  from '@/pages/tool/DateTimeTool'
import  { getFloat }  from '@/pages/tool/FormatNumber'

const { TextArea } = Input;
const { Option } = Select;

@connect(({ Cre,loading }) => ({
  Cre,
  loading:loading.models.Cre
}))
@Form.create()
class LoanReject extends PureComponent {
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
        fee:values.fee?Number(values.fee).toFixed(2):null
      }
      const obj = {
        reqData:{
          ...values,
          eventTime:(values.eventTime).format('YYYY-MM-DD HH:mm:ss'),
          failReasonCode:values.code?values.code:null,
          failReasonMessage:values.message?values.message:null,
          loanAmount:(Number(values.loanAmount).toFixed(2)).toString(),
          extendInfo:values.fee?JSON.stringify(en):null,
          loanId:record.id,
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

  changeAmount = (value)=>{
    const { form } = this.props;
    const loanAmountApple = form.getFieldValue("loanAmountApple")
    const fee = Number(loanAmountApple) - Number(value)
    form.setFieldsValue({
      fee
    })
  }

  onChangeDate = (date,dateString)=>{
    const { form } = this.props;
    const eventTime = date.format("YYYY-MM-DD");
    const statementPaymentTime = form.getFieldValue("statementPaymentTime").format("YYYY-MM-DD");
    const day = getDaysBetween(eventTime, statementPaymentTime); //相差天数
    const loanAmountApple = form.getFieldValue("loanAmountApple"); //申请放款金额
    const rate = form.getFieldValue("rate"); //年收益
    const dr = Number(rate || 0) / 360; //日利率
    const dd = getFloat(dr, 8); //日利率四舍五入
    console.log(Number(loanAmountApple) * dd * day);
    const jieguo = Number(loanAmountApple || 0) * dd * day;
    const fee = getFloat(jieguo, 2);
    const loanAmount = Number(loanAmountApple) - fee;
    form.setFieldsValue({
      fee:fee.toFixed(2),
      loanAmount:loanAmount.toFixed(2)
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
        title={"支用"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='机构借据号'>
              {getFieldDecorator('institutionLoanNo',{
                rules: [{
                  required: true,
                  message:'机构借据号'
                }]
              })(
                <Input placeholder="请输入机构借据号"/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="支用放款状态">
              {getFieldDecorator('status',{
                rules: [{
                  required: true,
                  message:'支用放款状态'
                }]
              })( <Select  style={{ width: '100%' }} placeholder={'请选择状态'}>
                {/*<Option value="FAILED">放款拒绝</Option>*/}
                <Option value="SUCCESS">放款成功</Option>
                <Option value="FAILED">放款失败</Option>
              </Select>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="实际放款日期">
              {getFieldDecorator('eventTime',{
                rules: [{
                  required: true,
                  message:'实际放款日期'
                }]
              })( <DatePicker placeholder="请输入实际放款日期" showTime style={{width:'100%'}} onChange={this.onChangeDate}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='结算单付款日期'>
              {getFieldDecorator('statementPaymentTime',{
                initialValue:record.statementPaymentTime?moment(record.statementPaymentTime,"YYYY-MM-DD HH:mm:ss"):[]
              })(
                <DatePicker showTime placeholder="带入结算单付款日期" style={{width:'100%'}} disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="执行年化费率">
              {getFieldDecorator('rate',{
                rules: [{
                  required: true,
                  message:'放款金额'
                }],
                initialValue:record.rate
              })( <Input placeholder={'带入执行年化费率'} disabled/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='申请放款金额'>
              {getFieldDecorator('loanAmountApple',{
                initialValue:record.loanAmount
              })(
                <Input placeholder="请输入申请放款金额" disabled/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label="服务费用">
              {getFieldDecorator('fee',{
              })(<Input placeholder="请输入服务费用" type={'number'} disabled/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="放款金额(单位：元)">
              {getFieldDecorator('loanAmount',{
                rules: [{
                  required: true,
                  message:'放款金额'
                }]
              })( <Input placeholder={'请输入放款金额'} type={Number} disabled/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="阿里支用申请单号">
              {getFieldDecorator('loanApplyId',{
                initialValue:record.loanApplyNo,
                rules: [{
                  required: true,
                  message:'阿里支用申请单号'
                }]
              })(<Input placeholder="请输入阿里支用申请单号" disabled/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='对接渠道'>
              {getFieldDecorator('channel',{
                rules: [{
                  required: true,
                  message:'对接渠道'
                }]
              })(
                <Input placeholder="请输入对接渠道"/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="拒绝原因码">
              {getFieldDecorator('code',{
              })(<Input placeholder="请输入拒绝原因码"/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>

          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={24} md={24} sm={24}>
            <Form.Item label="拒绝原因描述">
              {getFieldDecorator('message', {
              })(<TextArea rows={4} />)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default LoanReject;

