import React, { Component , useState } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { getUUId } from "../../utils/utils";
import { Form, Input, Button, message, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
class Register extends Component {
  state = {
    uid: getUUId(),
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    type:0
  };


  componentDidUpdate() {
    const { form, register } = this.props;
    const account = form.getFieldValue('mail');
    if (register.status === 'ok') {
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha =  () => {
    const { dispatch , form } = this.props;
    const mobile = form.getFieldValue('mobile');
    const prefix = form.getFieldValue('prefix');
    form.validateFields( ['mobile'] , { force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type:"login/getCaptcha",
          payload:{ mobile,uid:this.state.uid,prefix },
          callback: (res)=>{
            let count = 59;
            this.setState({ count });
            this.interval = setInterval(() => {
              count -= 1;
              this.setState({ count });
              if (count === 0) {
                clearInterval(this.interval);
              }
            }, 1000);
          }
        })
      }
    });
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { uid , type }  = this.state;
    form.validateFields({ force: true }, (err, values) => {
      values = {...values,uid,type}
      if (!err) {
        const { prefix } = this.state;
        dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            prefix,
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible ,type} = this.state;
    return (
      <div className={styles.main}>
        <h3 style={{height:"30px",display:"flex",textAlign:"center"}}>
            <span className={type==0?`${styles.regisActived} ${styles.regis}`:styles.regis} onClick={()=>{this.setState({type:0})}}>
              个人注册
            </span>
            <span className={type==1?`${styles.regisActived} ${styles.regis}`:styles.regis} onClick={()=>{this.setState({type:1})}}>
              企业注册
            </span>
        </h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: "请输入姓名！",
                },
                {
                  type: 'string',
                  message: "姓名格式错误！",
                },
              ],
            })(
              <Input size="large" placeholder={"姓名"} />
            )}
          </FormItem>
          {type == 0 ?
            <div>
              <FormItem>
                  {getFieldDecorator('idcard', {
                    rules: [
                      {
                        required: true,
                        message: "请输入身份证号！",
                      },
                      {
                        pattern: /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/,
                        message: "身份证号格式错误！",
                      },
                    ],
                  })(
                    <Input size="large" placeholder={"身份证号"} />
                  )}
                </FormItem>
              </div>:
              <div>
              <FormItem >
                {getFieldDecorator('bpname', {
                  rules: [
                    {
                      required: true,
                      message: "请输入企业名称！",
                    },
                    {
                      type: 'string',
                      message: "企业名称格式错误！",
                    },
                  ],
                })(
                  <Input size="large" placeholder={"企业名称"} />
                )}
              </FormItem>
                <FormItem key="license">
                {getFieldDecorator('license', {
                  rules: [
                    {
                      required: true,
                      message: "请输入营业执照号！",
                    },
                    {
                      type: 'string',
                      message: "营业执照格式错误！",
                    },
                  ],
                })(
                  <Input size="large" placeholder={"营业执照"} />
                )}
                </FormItem>
              </div>
          }
          <FormItem help={help}>
            <Popover
              getPopupContainer={node => node.parentNode}
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FormattedMessage id="validation.password.strength.msg" />
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder={formatMessage({ id: 'form.password.placeholder' })}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.confirm-password.required' }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
              />
            )}
          </FormItem>
          <FormItem>
            
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.phone-number.required' }),
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                  },
                ],
              })(
                <Input
                  size="large"
                  placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
                />
              )}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('captcha', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.verification-code.required' }),
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                  />
                )}
              </Col>
              <Col span={8}>
                <Button
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.onGetCaptcha}
                >
                  {count
                    ? `${count} s`
                    : "获取验证码"}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="app.register.register" />
            </Button>
            <Link className={styles.login} to="/User/Login">
              <FormattedMessage id="app.register.sign-in" />
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Register;
