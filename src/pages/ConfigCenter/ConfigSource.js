import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Collapse,
  Form,
  Input,
  Button,
  Card,
  Icon,
  Tooltip,
  Cascader
} from 'antd';
import geographic from '@/utils/geographic';
import EditableLinkGroup from '@/components/EditableLinkGroup';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
const Panel = Collapse.Panel;

const FormItem = Form.Item;
const links = [
  {
    title: '操作一',
    href: '',
  },
  {
    title: '操作二',
    href: '',
  },
  {
    title: '操作三',
    href: '',
  },
  {
    title: '操作四',
    href: '',
  },
  {
    title: '操作五',
    href: '',
  },
  {
    title: '操作六',
    href: '',
  },
];

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class ConfigSource extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };



  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper
        title="收费项目"
        content="配置收费相关信息"
      >
        <Card
          style={{ marginBottom: 24 }}
          title="快速开始 / 便捷导航"
          bordered={false}
          bodyStyle={{ padding: 0 }}
        >
          <EditableLinkGroup onAdd={() => {}} links={links} linkElement={Link} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ConfigSource;
