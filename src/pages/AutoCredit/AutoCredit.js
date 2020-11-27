import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Button, message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moneyToNumValue from '@/pages/tool/stringToMoney';
const FormItem = Form.Item;

@connect(({ auto, loading }) => ({
  auto,
  loading: loading.effects['auto/setAutoCredit']
}))
@Form.create()
class AutoCredit extends PureComponent {
  state = {
    largeAmount:null,
    id:null,
    status:true,
    onSaveStatus:true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'auto/queryLargeAmount',
      payload:{
        reqData:{}
      },
      callback:(res)=>{
        console.log("res",res)
        if(res && res.resData.length){
          const data = res.resData[0];
          this.setState({
            largeAmount:Number(data.largeAmount).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,'),
            id:data.id,
          })
        }
      }
    })
  }

  onLargeAmount = ()=>{
    const { form } = this.props;
    const largeAmount = form.getFieldValue("largeAmount");
    if(isNaN(Number(largeAmount)) || largeAmount === null){
      form.setFieldsValue({
        largeAmount:null
      })
      this.setState({
        onSaveStatus:true
      })
    }else{
      form.setFieldsValue({
        largeAmount:Number(largeAmount).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
      })
      this.setState({
        onSaveStatus:false
      })
    }
  }

  setLargeAmount = ()=>{
    const { form } = this.props;
    form.setFieldsValue({
      largeAmount:null
    })
    this.setState({
      status:false
    })
  }

  onSubmit = ()=>{
    const { form,dispatch } = this.props;
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const { id } = this.state;
      const largeAmount = values.largeAmount;
      let obj = {
        largeAmount:moneyToNumValue(largeAmount)
      }
      if(id){
        obj.id = id;
      }
      console.log("obj",obj)
      dispatch({
        type:'auto/setAutoCredit',
        payload:{
          reqData:{
            ...obj
          }
        },
        callback:(res)=>{
          if(res.errCode === 200){
            message.success("设置成功",1.5,()=>{
              this.setState({
                status:true,
                onSaveStatus:true,
              })
            })
          }else{
            message.error("设置失败，请重新设置")
          }
        }
      })
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;

    const { largeAmount,status,onSaveStatus } = this.state;

    return (
      <PageHeaderWrapper>
        <Card>
          <Form layout="inline">
            <Row gutter={16}>
              <Col md={14} sm={16}>
                <FormItem label='授权最大额度'>
                  {getFieldDecorator('largeAmount',{
                    initialValue:largeAmount
                  })(<Input placeholder='请输入额度' onBlur={this.onLargeAmount} disabled={status}/>)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
                <span>
                  <Button type="primary" loading={loading} onClick={this.onSubmit} disabled={onSaveStatus}>
                    确定
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.setLargeAmount}>
                   修改
                  </Button>
                </span>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AutoCredit;
