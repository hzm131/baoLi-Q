import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


@connect(({ auto, loading }) => ({
  auto,
}))
@Form.create()
class AutoCredit extends PureComponent {
  state ={

  }

  componentDidMount() {

  }


  render() {
    const {
      loading
    } = this.props;


    return (
      <PageHeaderWrapper>
        1
      </PageHeaderWrapper>
    );
  }
}

export default AutoCredit;
