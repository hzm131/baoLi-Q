import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Card,
  Row,
  Col,
  Icon, Popconfirm, Checkbox,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../System/UserAdmin.less';
import ModelTable from '../tool/ModelTable/ModelTable';
import NormalTable from '@/components/NormalTable';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
import './tableBg.less'

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
    conditions:[],
    record:{},
    rowId:null,
    superId:null,
    expandForm:false,
    TableData:[],
    SelectValue:[],
    selectedRowKeys:[],
    conditionsUser:[],
    page:{},
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
    const { SelectValue,selectedRowKeys } = this.state
    form.validateFieldsAndScroll((err,values)=>{
      const { productCode,creditApplyNo,customerId,companyName,legalPersonName,
        legalPersonPhoneNo,userDate,userName} = values;
      if(productCode || creditApplyNo || customerId || companyName||legalPersonName||
        legalPersonPhoneNo ||userDate ||userName) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};
        let customerIdObj = {};
        let companyNameObj = {};
        let legalPersonNameObj = {};
        let legalPersonPhoneNoObj = {};
        let usernameObj = {};
        let startObj = {};
        let endObj = {};

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
        if (customerId) {
          customerIdObj = {
            code: 'customer_id',
            exp: 'like',
            value: customerId
          };
          conditions.push(customerIdObj)
        }
        if (companyName) {
          companyNameObj = {
            code: 'company_name',
            exp: 'like',
            value: companyName
          };
          conditions.push(companyNameObj)
        }
        if (legalPersonName) {
          legalPersonNameObj = {
            code: 'legal_person_name',
            exp: 'like',
            value: legalPersonName
          };
          conditions.push(legalPersonNameObj)
        }
        if (legalPersonPhoneNo) {
          legalPersonPhoneNoObj = {
            code: 'legal_person_phone_no',
            exp: 'like',
            value: legalPersonPhoneNo
          };
          conditions.push(legalPersonPhoneNoObj)
        }
        if(userDate && userDate.length){
          startObj = {
            code:'user_date',
            exp:'>=',
            value:userDate[0].format('YYYY-MM-DD')
          };
          conditions.push(startObj)

          endObj = {
            code:'user_date',
            exp:'<=',
            value:userDate[1].format('YYYY-MM-DD')
          };
          conditions.push(endObj)
        }
        if(userName){
          usernameObj = {
            code: 'user_id',
            exp: '=',
            value: selectedRowKeys[0]
          };
          conditions.push(usernameObj)
        }
        this.setState({conditions})
        console.log("conditions",conditions)
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

  toggleForm = () =>{
    const { expandForm } = this.state
    this.setState({expandForm:!expandForm})
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      dispatch,
    } = this.props;
    const { expandForm } = this.state;
    const on = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'Cre/fetchUcum',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            if(res){
              this.setState({
                TableData:res,
              })
            }
          }
        })
      },
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        console.log('--',selectedRows)
        const nameList = selectedRows.map(item =>{
          return item.userName
        });
        onChange(nameList)
        this.setState({
          SelectValue:nameList,
          selectedRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { conditionsUser } = this.state;
        const param = {
          ...obj
        };
        this.setState({
          page:param
        });
        if(conditionsUser.length){
          dispatch({
            type:'Cre/fetchUcum',
            payload:{
              conditions:conditionsUser,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'Cre/fetchUcum',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
        const { userName } = values;
        if(userName){
          let conditions = [];
          let nameObj = {};

          if(userName){
            nameObj = {
              code:'user_name',
              exp:'like',
              value:userName
            };
            conditions.push(nameObj)
          }
          this.setState({
            conditionsUser:conditions,
          });
          const obj = {
            conditions,
          };
          dispatch({
            type:'Cre/fetchUcum',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { page } = this.state;
        this.setState({
          conditionsUser:[]
        });
        dispatch({
          type:'Cre/fetchUcum',
          payload:{
            ...page
          },
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectValue:[],
          selectedRowKeys:[],
        })
      }
    };
    const onData = {
      TableData:this.state.TableData,
      SelectValue:this.state.SelectValue,
      selectedRowKeys:this.state.selectedRowKeys,
      columns :[
        {
          title: '用户名',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          title: '管理员',
          dataIndex: 'isAdmin',
          key: 'isAdmin',
          render: (text, record) =>{
            return <Checkbox checked={text}/>
          }
        },
        {
          title: '权限',
          dataIndex: 'authority2',
          key: 'authority2',
        },
        {
          title: '注册时间',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'用户名',code:'userName',placeholder:'请输入用户名'},
      ],
      title:'人员管理',
      placeholder:'请选择人员',
    };
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='产品编码'>
              {getFieldDecorator('productCode')(<Input placeholder='请输入产品编码' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='授信单号'>
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
            {
              expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起
                <Icon type="up" />
              </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开
                <Icon type="down" />
              </a>
            }
          </Col>
        </Row>
        {expandForm? <div>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={16}>
              <FormItem label='阿里客户'>
                {getFieldDecorator('customerId')(<Input placeholder='请输入阿里客户' />)}
              </FormItem>
            </Col>
            <Col md={8} sm={16}>
              <FormItem label='公司名称'>
                {getFieldDecorator('companyName')(<Input placeholder='请输入公司名称' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={16}>
              <FormItem label='法人姓名'>
                {getFieldDecorator('legalPersonName')(<Input placeholder='请输入法人姓名' />)}
              </FormItem>
            </Col>
            <Col md={8} sm={16}>
              <FormItem label='法人手机'>
                {getFieldDecorator('legalPersonPhoneNo')(<Input placeholder='请输入法人手机' type={'number'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={16}>
              <FormItem label='审批人员'>
                {getFieldDecorator('userName')(<ModelTable
                  data={onData}
                  on={on}
                />)}
              </FormItem>
            </Col>
            <Col md={8} sm={16}>
              <FormItem label='审批时间'>
                {getFieldDecorator('userDate')(<RangePicker  style={{width:'100%',}}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>:''}
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
    router.push(`/credit/creditInfo/${record.id}`)
  }

//取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[],
      TableData:[],
      SelectValue:[],
      selectedRowKeys:[],
      conditionsUser:[],
      page:{},
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
        title: '审批人员',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '审批时间',
        dataIndex: 'userDate',
        key: 'userDate',
      },
      {
        title: '操作',
        fixed:'right',
        dataIndex: 'operation',
        render: (text,record) =>
        {
          return <Fragment>
            <a href="#javascript:;" onClick={(e) => this.handleLook(e,record)}>查看</a>
          </Fragment>
        }
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} >{this.renderForm()}</div>
            <div style={{marginTop:'20px'}}>
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

          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Credit;
