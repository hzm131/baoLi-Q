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

@connect(({ Cre, loading }) => ({
  Cre,
  loading: loading.models.Cre,
}))
@Form.create()
class Credit extends PureComponent {
  state ={
    addVisible:false,
    updateVisible:false,
    viewVisible:false,
    updata:{},
    record:{},
    rowId:null,
    superId:null,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'Cre/fetch',
      payload:{
          pageIndex:0,
          pageSize:10
      }
    })
  }
  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const {productCode,creditApplyNo} = values;
      if(productCode || creditApplyNo) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if (productCode) {
          codeObj = {
            code: 'product_code',
            exp: 'like',
            value: productCode
          };
          conditions.push(codeObj)
        }
        if (creditApplyNo) {
          nameObj = {
            code: 'credit_apply_no',
            exp: 'like',
            value: creditApplyNo
          };
          conditions.push(nameObj)
        }
        this.setState({conditions})
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type:'Cre/fetch',
          payload: obj
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'Cre/fetch',
          payload: {
            pageIndex:0,
            pageSize:10
          }
        })
      }
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='产品编码'>
              {getFieldDecorator('productCode')(<Input placeholder='请输入产品编码' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='授信申请单号'>
              {getFieldDecorator('creditApplyNo')(<Input placeholder='请输入授信申请单号' />)}
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

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'Cre/fetch',
        payload: param,
      });
      return
    }
    this.setState({
      pageIndex:obj.pageIndex
    });
    dispatch({
      type:'Cre/fetch',
      payload: obj,
    });
  };

  handleLook = (e,record)=>{
    e.preventDefault()
    router.push('/credit/creditInfo',{record})
  }

//取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[],
    })
    //清空后获取列表
    dispatch({
      type:'Cre/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }


  render() {
    const {
      form:{getFieldDecorator},
      Cre:{fetchData}
    } = this.props;
    const columns = [
      {
        title: '接收时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '产品编号',
        dataIndex: 'productCode',
        key: 'productCode',
      },
      {
        title: '授信申请单号',
        dataIndex: 'creditApplyNo',
        key: 'creditApplyNo',
      },

      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render:((text,record)=>{
          if(text === 'QUALIFIED'){
            return '授信成功'
          }else if(text === 'REJECTED'){
            return '授信拒绝'
          }
        })
      },
      {
        title: '阿里客户',
        dataIndex: 'customerId',
        key: 'customerId',
      },
      {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '枚举类型',
        dataIndex: 'companyLicenseType',
        key: 'companyLicenseType',
        render:((text,record)=>{
          if(text === 'UNITY'){
            return '企业的统一社会信用代码'
          }else if(text === 'GENERAL'){
            return '传统工商注册类型'
          }
        })
      },
      {
        title: '法人姓名',
        dataIndex: 'legalPersonName',
        key: 'legalPersonName',
      },
      {
        title: '企业身份标识号码',
        dataIndex: 'companyLicenseNo',
        key: 'companyLicenseNo',
      },
      {
        title: '法人证件类型',
        dataIndex: 'legalPersonLicenseType',
        key: 'legalPersonLicenseType',
        render:((text,record)=>{
          if(text === 'IDENTITY_CARD'){
            return '身份证'
          }else {
            return '其他'
          }
        })
      },
      {
        title: '法人证件号码',
        dataIndex: 'legalPersonLicenseNo',
        key: 'legalPersonLicenseNo',
      },
      {
        title: '法人手机号',
        dataIndex: 'legalPersonPhoneNo',
        key: 'legalPersonPhoneNo',
      },
      {
        title: '法人婚姻状态',
        dataIndex: 'legalPersonMaritalStatus',
        key: 'legalPersonMaritalStatus',
        render:((text,record)=>{
          if(text === 'UNMARRIED'){
            return '未婚'
          }else if(text === 'MARRIED'){
            return '已婚'
          }else if(text === 'DIVORCE'){
            return '离异'
          }else if(text === 'WIDOWED'){
            return '丧偶'
          }
        })
      },
      {
        title: '法人配偶姓名',
        dataIndex: 'legalPersonMateName',
        key: 'legalPersonMateName',
      },

      {
        title: '操作',
        fixed:'right',
        dataIndex: 'operation',
        render: (text,record) =>
        {
          if(record.type === 1){
            return <Fragment>
              <a href="#javascript:;" onClick={(e) => this.handleLook(e,record)}>查看</a>
            </Fragment>
          }else{
            return <span style={{color:'#ccc'}}>查看</span>
          }
        }
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} >{this.renderForm()}</div>
            <NormalTable
              columns={columns}
              data={fetchData}
              onRow={(record )=>{
                return {
                  onClick:()=>{
                    this.setState({
                      rowId: record.id,
                      superId:record.id,
                      record:record,
                    })
                  },
                  rowKey:record.id
                }
              }}
              rowClassName={this.setRowClassName}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Credit;
