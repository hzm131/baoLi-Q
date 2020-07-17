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

  }

  componentDidMount() {

  }

//查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const {loanApplyNo,loanNo} = values;
      console.log('-values-',values)
    })
  }

  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
  }
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='贷款申请编号'>
              {getFieldDecorator('loanApplyNo')(<Input placeholder='请输入贷款申请编号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='贷款合同编号'>
              {getFieldDecorator('loanNo')(<Input placeholder='请输入贷款合同编号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
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
                <FormItem label='贷款申请编号'>
                  {getFieldDecorator('loanApplyNo')(<Input placeholder='请输入贷款申请编号' />)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
                <FormItem label='贷款合同编号'>
                  {getFieldDecorator('loanNo')(<Input placeholder='请输入贷款合同编号' />)}
                </FormItem>
              </Col>
              <Col md={8} sm={16}>
            <span>
              <Button type="primary" htmlType="submit">
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
