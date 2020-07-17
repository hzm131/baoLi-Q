import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Popconfirm,
  Divider,
  Icon,
  Table,
  Row,
  Modal,
  Col,
  message,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../System/UserAdmin.less';
import NormalTable from '@/components/NormalTable';
const FormItem = Form.Item;
import './tableBg.less'
// import styles from './style.less';
const { Option } = Select;
const { TextArea } = Input;

@connect(({ organ, loading }) => ({
  organ,
  loading: loading.models.organ,
}))
@Form.create()
class Organ extends PureComponent {
  state ={
    loanApplyNo:'',
    isDis:true,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'organ/findLoan',
      payload:{
         reqData:{
           appId:1
         }
      },
      callback:(res)=>{
        if(res.resData){
          this.setState({
            loanApplyNo:res.resData.serial
          })
        }
      }
    })
  }

//查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const { serial } = values;
      if(serial){
        dispatch({
          type:'organ/updateOrgan',
          payload:{
            reqData:{
              appId:1,
              serial:serial
            }
          },
          callback:(res)=>{
            if(res.errCode === 200){
              message.success('成功',1.5,()=>{
                this.setState({
                  isDis:true,
                })
                dispatch({
                  type:'organ/findLoan',
                  payload:{
                    reqData:{
                      appId:1
                    }
                  },
                  callback:(res)=>{
                    if(res.resData){
                      this.setState({
                        loanApplyNo:res.resData.serial
                      })
                    }
                  }
                })
              })
            }else{
              message.error('失败')
            }
            console.log('结果',res)
          }
        })
      }
    })
  }

  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this,this.setState({
      isDis:true,
    })
    dispatch({
      type:'organ/findLoan',
      payload:{
        reqData:{
          appId:1
        }
      },
      callback:(res)=>{
        if(res.resData){
          this.setState({
            loanApplyNo:res.resData.serial
          })
        }
      }
    })
  }

  update = ()=>{
    const { isDis } = this.state
    this.setState({
      isDis:false
    })
  }



  render() {
    const {
      form:{getFieldDecorator},
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Card>
          <Form onSubmit={this.findList} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={16}>
                <FormItem label='机构授信编号'>
                  {getFieldDecorator('serial',{
                    initialValue:this.state.loanApplyNo
                  })(<Input placeholder='请输入机构授信编号' disabled={this.state.isDis}/>)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
            <span>
               <Button type="primary" onClick={this.update} >
                编辑
              </Button>
              <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                确定
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
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

export default Organ;
