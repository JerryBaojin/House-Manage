import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Skeleton,
  Tag,
  Collapse,
  InputNumber,
  Form,
  Input,
  Button,
  Card,
  Icon,
  Tooltip,
  Cascader,
  Modal,
  Popconfirm,
  Select,
  DatePicker,
  Row,
  Spin,
  Col
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Room.less';
const { Option } = Select;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};


@connect(({sourceConfig,loading})=>({
}))
@Form.create()
class Rent extends PureComponent {

  handleSubmit = e => {
    const { dispatch, form,state } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

      }
    });
  };

  render() {
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (

      <div>
        room
      </div>

    );
  }
}

export default Rent;
