import React, { Component , useState } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { getUUId } from "../../utils/utils";
import { Form, Input, Button, message, Select, Row, Col, Popover, Progress, Icon } from 'antd';
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
    type:0,
    subt: false
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
    this.setState({
      subt:true
    })
    form.validateFields((err, values) => {
      values = {...values,uid,type}
      if (!err) {
        const { prefix } = this.state;
       
        dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            prefix,
          },
          callback:()=>{
            this.setState({
              subt:false
            })
          }
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
    if(this.state.subt)return null;
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
        <Form onSubmit={this.handleSubmit}>
          <div className={styles.regbox}></div>
            <div className={styles.regmain}>
              <div className={styles.regtt}>新用户注册</div>
                <div className={styles.reginput}>
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
                          prefix={<Icon type="mobile" />}
                          size="large"
                          placeholder="请输入11位手机号码"
                        />
                      )}
                  </FormItem>
                  <FormItem>
                    <Row gutter={8}>
                      <Col span={18}>
                        {getFieldDecorator('captcha', {
                          rules: [
                            {
                              required: true,
                              message: formatMessage({ id: 'validation.verification-code.required' }),
                            },
                          ],
                        })(
                          <Input
                            prefix={<Icon type='mail'/>}
                            size="large"
                            placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                          />
                        )}
                      </Col>
                      <Col span={6}>
                        <Button
                          disabled={count}
                          style={{height:37,width:"100%"}}
                          onClick={this.onGetCaptcha}
                        >
                          {count
                            ? `${count} s`
                            : "获取验证码"}
                        </Button>
                      </Col>
                    </Row>
                  </FormItem>
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
                      visible={false}
                    >
                      {getFieldDecorator('password', {
                        rules: [
                          {
                            validator: this.checkPassword,
                          },
                        ],
                      })(
                        <Input
                          onBlur={()=>{this.setState({visible:false})}}
                          prefix={<Icon type='lock'/>}
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
                        prefix={<Icon type='lock'/>}
                        size="large"
                        type="password"
                        placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
                      />
                    )}
                  </FormItem>
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
                  
                      <Input     prefix={<Icon type="border-bottom" />} size="large" placeholder={"企业名称"} />
                    )}
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
                </div>
            
            </div>
          </Form>
      
      </div>
    );
  }
}

export default Register;
