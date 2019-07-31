import React, { Fragment, useState } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Radio,
  DatePicker,
  Modal,
  notification,
} from 'antd';
import router from 'umi/router';
import styles from './style.less';
const { RangePicker } = DatePicker;
const { Option } = Select;
const InputGroup = Input.Group;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ form, loading }) => ({
  loading: loading.effects['form/submitRegularForm'],
  data: form.step,
}))
@Form.create()
class Step1 extends React.PureComponent {
  state = {
    srVisible: false,
    zcVisible: false,
    owntype: 0,
    srlxName: '',
    zclxName: '',
  };


  componentDidMount() {

    const { dispatch } = this.props;

    dispatch({
      type: 'form/getCommunityName',
    });

    dispatch({
      type: 'form/getProjectName',
    });
  }

  handleChangeType = key => {
    let owntype;
    key.target.value == 'zc' ? (owntype = 1) : (owntype = 0);
    this.setState({ owntype });
  };
  handleProjectChange = value => {
    if (value == 'createNewSrProject') {
      this.setState({
        srVisible: true,
      });
    } else if (value == 'createNewZcProject') {
      this.setState({
        zcVisible: true,
      });
    }
  };

  handleSrDirInput = e => {
    this.setState({
      srlxName: e.target.value,
    });
  };

  handleZcDirInput = e => {
    this.setState({
      zclxName: e.target.value,
    });
  };

  handleZcOk = e => {

    this.props.form.setFieldsValue({
      zclx: this.state.zclxName,
    });
    setTimeout(() => {
      this.setState({
        zcVisible: false,
      });
    }, 1000);
  };

  handleSrOk = e => {

    this.props.form.setFieldsValue({
      srlx: this.state.srlxName,
    });
    setTimeout(() => {
      this.setState({
        srVisible: false,
      });
    }, 1000);
  };

  disPlayProject(data) {
    if (typeof data !== 'object') return;
    let comPone = [];
    data.forEach((val, key) => {
      comPone.push(
        <Option key={key} value={val}>
          {val}
        </Option>
      );
    });
    return comPone;
  }

  render() {
    const { owntype } = this.state;
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/saveStepFormData',
            payload: values,
          });
        } else {
          notification.error({
            message: '请填写房源信息!',
          });
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="所有方式">
            {getFieldDecorator('owntype', {
              initialValue: 'sr',
              rules: [{ required: true, message: '请选择所有方式' }],
            })(
              <Radio.Group
                onChange={key => {
                  this.handleChangeType(key);
                }}
              >
                <Radio key="0" value="sr">
                  收入
                </Radio>
                <Radio key="1" value="zc">
                  支出
                </Radio>
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="选择项目">
            {getFieldDecorator('project', {
              // initialValue: 'alipay',
              rules: [
                {
                  required: true,
                  message: '请选择项目',
                },
              ],
            })(
              <Select onChange={this.handleProjectChange} style={{ width: 200 }}>
                {this.disPlayProject(data.project)}
              </Select>
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="选择小区">
            {getFieldDecorator('community', {
              rules: [
                {
                  required: true,
                  message: '请选择小区',
                },
              ],
            })(
              <Select onChange={this.handleCommunityChange} style={{ width: 200 }}>
                {this.disPlayProject(data.community)}
              </Select>
            )}
          </Form.Item>

          {owntype == 1 ? (
            <Form.Item {...formItemLayout} label="支出类型">
            {getFieldDecorator('zclx', {
              initialValue: '房屋租金',
              rules: [
                {
                  required: true,
                  message: '请选择支出类型',
                },
              ],
            })(
              <Select onChange={this.handleProjectChange} style={{ width: 200 }}>
                {this.disPlayProject(data.srlx)}
                <Option value="createNewZcProject">其他</Option>
              </Select>
            )}
          </Form.Item>
          ) : (<Form.Item {...formItemLayout} label="收入类型">
            {getFieldDecorator('srlx', {
              initialValue: '房屋租金',
              rules: [
                {
                  required: true,
                  message: '请选择收入类型',
                },
              ],
            })(
              <Select onChange={this.handleProjectChange} style={{ width: 200 }}>
                {this.disPlayProject(data.srlx)}
                <Option value="createNewSrProject">其他</Option>
              </Select>
            )}
          </Form.Item>)}

          <Form.Item {...formItemLayout} label={'选择时间'}>
            {getFieldDecorator('date', {
              rules: [
                {
                  required: true,
                  message: '请选择时间',
                },
              ],
            })(<DatePicker showTime style={{ width: '100%' }} />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="收款方式">
            {getFieldDecorator('skfs', {
              initialValue: '现金支付',
              rules: [
                {
                  required: true,
                  message: '请选择收款方式',
                },
              ],
            })(
              <Select style={{ width: 200 }}>
                {this.disPlayProject(data.skfs)}
              </Select>
            )}
          </Form.Item>

          {owntype == 1 ? (
            <Form.Item {...formItemLayout} label="支出金额">
            {getFieldDecorator('money', {
              initialValue: '0',
              rules: [
                {
                  required: true,
                  message: '请选择支出类型',
                },
              ],
            })(
              <InputNumber
                style={{ width: 200 }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            )}
          </Form.Item>
          ) : (<Form.Item {...formItemLayout} label="收入金额">
            {getFieldDecorator('money', {
              initialValue: '0',
              rules: [
                {
                  required: true,
                  message: '请填写收入金额',
                },
              ],
            })(<InputNumber
                style={{ width: 200 }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />)}
          </Form.Item>)}

          <Form.Item {...formItemLayout} label={'经手人'}>
            {getFieldDecorator('handle', {
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<Input type="text" placeholder="请输入" />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label={'备注'}>
            {getFieldDecorator('remark', {
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<Input type="text" placeholder="备注" />)}
          </Form.Item>

          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              提交
            </Button>
          </Form.Item>
        </Form>

        <Modal
          title="收入类型"
          visible={this.state.srVisible}
          onOk={this.handleSrOk}
          onCancel={() => {
            this.setState({
              srVisible: false,
            });
          }}
        >
          <Input onChange={this.handleSrDirInput} placeholder="请输入收入类型名称" type="text" />
        </Modal>

        <Modal
          title="支出类型"
          visible={this.state.zcVisible}
          onOk={this.handleZcOk}
          onCancel={() => {
            this.setState({
              zcVisible: false,
            });
          }}
        >
          <Input onChange={this.handleZcDirInput} placeholder="请输入支出类型名称" type="text" />
        </Modal>

        {/*<Divider style={{ margin: '40px 0 24px' }} />*/}
        {/*<div className={styles.desc}>
          <h3>说明</h3>
          <h4>转账到支付宝账户</h4>
          <p>
            如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
          </p>
          <h4>转账到银行卡</h4>
          <p>
            如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
          </p>
        </div>*/}
      </Fragment>
    );
  }
}

export default Step1;
