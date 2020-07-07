import React, { PureComponent, Fragment } from 'react';
import { Table, Button, AutoComplete,Input, Form,message,DatePicker, Popconfirm, Divider } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './style.less';
import storage from '@/utils/storage';
import moment from 'moment';
import { connect } from 'dva';
const Option = AutoComplete.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
@connect(({ postmanagement, loading }) => ({
  postmanagement,
  loading: loading.models.postmanagement,
}))
@Form.create()
class LicenseTableFormPost extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
      licensedatasource:[],
      idList:[],
      workMode: ['month', 'month'],
      workValue: [],
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      licensename: '',
      // licensestat: '',
      status: '',
      acquiredate: '',
      // lp_id:0,
      license_id:0,
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
      const newData = data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
        target[fieldName] = e.target.value;
        this.setState({ data: newData });
      }
  }
  handleNChange(value,option, fieldName, key) {
    console.log('value',value);
    console.log('option',option);
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = option.props.children;
      target['license_id'] = Number(value);
      this.setState({ data: newData });
    }
  }

  handleFChange(date,dateString, fieldName, key) {
    console.log("dateString:",dateString)

    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = dateString;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.licensename || !target.status ||!target.acquiredate) {
        message.error('请填写完整牌照信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const {
      dispatch
    } = this.props;
    const userinfo = storage.get("userinfo");
    const corpId = userinfo.corp.id;

    const columns = [
      {
        title: '牌照名称',
        dataIndex: 'licensename',
        key: 'licensename',
        width: '40%',
        render: (text, record) => {
          if (record.editable) {
            return (
            <AutoComplete
              style={{ width: 200 }}
              dataSource={options}
              onFocus={()=>{
                dispatch({
                  type:'postmanagement/fetchlicen',
                  payload:{
                    id: corpId,
                  },
                  callback:(res)=>{
                    this.setState({
                      licensedatasource:res,
                    })
                  }
                });
              }}
              filterOption={(inputValue, option) =>
                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              onSelect={ (value,option) => this.handleNChange(value,option, 'licensename', record.key) }
              placeholder="牌照名称"
            />
            );
          }
          return text;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
            <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'status', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="状态"
              />

            );
          }
          return text;
        },
      },
      {
        title: '预计取得时间',
        dataIndex: 'acquiredate',
        key: 'acquiredate',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <DatePicker
                onChange={(date,dateString) => this.handleFChange(date,dateString, 'acquiredate', record.key)}
                placeholder="请选择日期" />
            );
          }
          return text;
        },
      },
      /*{
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },*/
    ];
    const options = this.state.licensedatasource.map(group => (
     <Option key={group.id}>{group.name}</Option>
    ));
    const { loading, data } = this.state;

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
{/*        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增牌照信息
        </Button>*/}
      </Fragment>
    );
  }
}

export default LicenseTableFormPost;
