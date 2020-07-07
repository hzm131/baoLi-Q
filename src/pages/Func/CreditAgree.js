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
  Icon,
  Button,
  Upload,
  TreeSelect,
} from 'antd';


@connect(({ Cre,loading }) => ({
  Cre,
  loading:loading.models.Cre
}))
@Form.create()
class CreditAgree extends PureComponent {
  state = {
    BStatus:false,
    pageStore:{},
    deleteFile:[],
    fileList:[],
  };

  onSave = (onSave)=>{
    const { form } = this.props;
    const { BStatus, } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
     const obj = {
        reqData:{
          ...values,
          status: 'QUALIFIED',
          channel: 'SHNF',
          endDate:values.endDate?(values.endDate).format('YYYY-MM-DD'):null,
          startDate:values.startDate?(values.startDate).format('YYYY-MM-DD'):null,
          eventTime:values.eventTime?(values.eventTime).format('YYYY-MM-DD'):null,
          creditTerm:values.creditTerm?Number(values.creditTerm):null,
          extendInfo:{
            loanLimitQuota:values.loanLimitQuota,
            customerId:2,
          }
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
    const { deleteFile,fileList } = this.state
    const { visible } = data;
    const { onSave,onCancel } = on;
    const props = {
      onRemove: file => {
        if(file.id){
          this.setState({
            deleteFile:[...this.state.deleteFile,file]
          })
        }
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    return (
      <Modal
        title={"同意"}
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
              })( <Input placeholder="请输入授信状态" />)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="事件发生时间">
              {getFieldDecorator('eventTime',{
                rules: [{
                  required: true,
                  message:'事件发生时间'
                }]
              })( <DatePicker style={{width:'100%'}} />)}
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
              })(<Input placeholder="请输入授信期限" type={'number'}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='授信期限单位'>
              {getFieldDecorator('creditTermUnit',{
              })(
                <Input placeholder="请输入授信期限单位"/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="授信有效期开始日">
              {getFieldDecorator('startDate',{
              })( <DatePicker style={{width:'100%'}} />)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="授信有效期结束日">
              {getFieldDecorator('endDate',{
              })(<DatePicker style={{width:'100%'}} />)}
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

          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>

          </Col>
        </Row>
        {/*<Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='文件'>
              {getFieldDecorator('uploadFile',{
              })(
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> 选择文件
                  </Button>
                </Upload>
              )}
            </Form.Item>
          </Col>

        </Row>*/}
      </Modal>
    );
  }
}

export default CreditAgree;

