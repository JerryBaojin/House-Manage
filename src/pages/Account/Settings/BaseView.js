import React, { Component, Fragment } from 'react';
import { Form, Input, Upload, Select, Button } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      头像
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    {/* <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
            更换头像
        </Button>
      </div>
    </Upload> */}
  </Fragment>
);



const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
 
    const url = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };
  handleSubmit =(e)=>{
    e.preventDefault();
    
    const { dispatch, form, data } = this.props;
    form.validateFieldsAndScroll((err, values) => {

      if (!err) {
          dispatch({
            type:"user/update",
            payload:values
          });
        
      }
    })
  }
  render() {
    const {
      currentUser,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
           
            {/* <FormItem label={"昵称"}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: false,
                    message: "昵称",
                  },
                ],
              })(<Input />)}
            </FormItem> */}
            {
              currentUser.bpname?(
                <FormItem label={"企业名称"}>
                  {getFieldDecorator('bpname', {
                    rules: [
                      {
                        required: false,
                        message: "企业名称",
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              ):null
            }
             {/* {
              currentUser.bpname?(
                <FormItem label={"营业执照号码"}>
                  {getFieldDecorator('license', {
                    rules: [
                      {
                        required: true,
                        message: "营业执照号码",
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              ):null
            } */}
            {
              currentUser.idcard?(
                <FormItem label={"身份证号"}>
                  {getFieldDecorator('idcard', {
                    rules: [
                      {
                        required: true,
                        message: "身份证号",
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              ):null
            }
            
         
            <FormItem label={"联系电话"}>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: "联系电话",
                  },
                  { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem>
            <Button type="primary" htmlType="submit">
              更新基本信息
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default BaseView;
