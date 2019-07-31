import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Alert,
  Divider,
  Table,
  Row,
  Col,
  Icon,
  Select,
  Modal,
  Checkbox,
} from 'antd';
import router from 'umi/router';
import { digitUppercase } from '@/utils/utils';
import styles from './style.less';
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))
@Form.create()
class Step2 extends React.PureComponent {
  state = {
    publicConfig: [
      'WIFI',
      '热水器',
      '洗衣机',
      '冰箱',
      '电视',
      '微波炉',
      '燃气灶',
      '抽油烟机',
      '电磁炉',
      '沙发',
    ],
    roomConfig: ['空调', '电视', '床', '书桌', '衣柜', '阳台', '独卫'],
    height: '84px',
    test: [1, 2, 3],
    houseNumber: 3,
  };
  handleClick() {}
  checkBoxChanged(val, type) {
    console.log(val, type);
  }
  render() {
    const { form, data, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { height, houseNumber, test, visible, publicConfig, roomConfig } = this.state;
    // this.setState({
    //   height:42 * data.form.houseNumber+"px"
    // })

    const onPrev = () => {
      router.push('/sourcemanage/step-form/info');
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, valuwwwes) => {
        if (!err) {
          dispatch({
            type: 'form/submitStepForm',
            payload: {
              ...data,
              ...values,
            },
          });
        } else {
          this.setState({
            height: '122px',
          });
        }
      });
    };
    const renderLists = number => {
      let tempDomStructor = [];
      const EI = ['A', 'B', 'C', 'D', 'E'];
      for (let i = 0; i < number.length; i++) {
        tempDomStructor.push(
          <Row key={number[i]} className={styles.tableList} style={{ width: '114.3%' }}>
            <Col span={2}>
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].name`, {
                  rules: [
                    {
                      required: true,
                      message: '请填写',
                    },
                  ],
                })(
                  <div>
                    <Button
                      onClick={({ nc = number[i] }) => {
                        this.setState({
                          test: number.filter(val => nc !== val),
                        });
                      }}
                      type="primary"
                      icon="delete"
                    />
                    {EI[i]}
                    <Input placeholder="房间名" />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].roomArea`, {
                  rules: [
                    {
                      required: true,
                      message: '请填写',
                    },
                  ],
                })(
                  <div>
                    <Input type="name" placeholder="" />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].direction`, {
                  initialValue: '请选择',
                  rules: [
                    {
                      required: true,
                      message: '请选择项目',
                    },
                  ],
                })(
                  <div>
                    <Select>
                      <Option value="东">东</Option>
                      <Option value="南">南</Option>
                      <Option value="西">西</Option>
                      <Option value="北">北</Option>
                      <Option value="东南">东南</Option>
                      <Option value="东北">东北</Option>
                      <Option value="西南">西南</Option>
                      <Option value="西北">西北</Option>
                    </Select>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].rentStatus`, {
                  initialValue: '请选择',
                  rules: [
                    {
                      required: true,
                      message: '请选择状态',
                    },
                  ],
                })(
                  <div>
                    <Select>
                      <Option value="1">在租</Option>
                      <Option value="0">未租</Option>
                    </Select>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={1}>
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].planMoney`, {
                  rules: [
                    {
                      required: true,
                      message: '请填写',
                    },
                  ],
                })(
                  <div>
                    <Input type="number" placeholder="" />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={2} style={{ display: 'flex' }}>
              付
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].payMonth`, {
                  rules: [
                    {
                      required: true,
                      message: '请填写',
                    },
                  ],
                })(
                  <div>
                    <Input type="number" placeholder="" />
                  </div>
                )}
              </Form.Item>
              押
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].mortgageMonth`, {
                  rules: [
                    {
                      required: true,
                      message: '请填写',
                    },
                  ],
                })(
                  <div>
                    <Input type="number" placeholder="" />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].rentMoney`, {
                  rules: [
                    {
                      required: true,
                      message: '请填写',
                    },
                  ],
                })(
                  <div>
                    <Input type="number" placeholder="租金" />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].payMoney`)(
                  <div>
                    <Input type="number" disabled={true} placeholder="房屋押金" />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Icon onClick={this.handleClick('roomDescription')} type="plus-square" />
            </Col>
            <Col span={2}>
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].notes`, {
                  rules: [
                    {
                      required: true,
                      message: '请填写',
                    },
                  ],
                })(
                  <div>
                    <Input type="number" placeholder="备注" />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Icon onClick={this.handleClick('roomConfig')} type="plus-square" />
            </Col>
          </Row>
        );
      }
      return tempDomStructor;
    };

    const renderConfig = type => {
      const virtualPreDom = [];
      type = 'publicConfig'
      if (type === 'publicConfig' || type === 'roomConfig') {
          const groups = [];
            this.state[type].forEach((val,index)=>
            {groups.push(
              <div>
                <Checkbox key={index} value={val}>
                  {val}
                </Checkbox>
              </div>
            )})
            virtualPreDom.push([
                    <Checkbox.Group style={{ width: '100%' }} onChange={(val, type) => this.checkBoxChanged}>
                    groups,
                    </Checkbox.Group>
                  ]);
      } else {
        virtualPreDom.push(
          <TextArea
            rows={4}
            placeholder="租客更喜欢详细的房源特色、小区商圈、交通情况等描述（建议150字以上）"
          />
        );
      }
      return virtualPreDom;
    };
    return (
      <Form className={styles.stepFormConfirm}>
        <Row className={styles.tableList} style={{ marginBottom: '20px' }}>
          <Col span={2}>门牌号</Col>
          <Col span={2}>房间名称</Col>
          <Col span={2}>房间面积</Col>
          <Col span={2}>朝向</Col>
          <Col span={2}>出租状态</Col>

          <Col span={1}>定金</Col>
          <Col span={2}>付款方式</Col>
          <Col span={2}>租金</Col>
          <Col span={2}>房屋押金</Col>
          <Col span={2}>房间描述</Col>
          <Col span={2}>房间配置</Col>
          <Col span={2}>备注</Col>
          <Col span={1}>公共配置</Col>
        </Row>

        <Row className={styles.fullContainer}>
          <Col span={2} style={{ border: 'none' }}>
            1栋--11
          </Col>
          <Col span={21} style={{ overflow: 'hidden' }}>
            {renderLists(test)}
          </Col>
          <Col span={1} style={{ border: 'none' }}>
            <Icon onClick={this.handleClick('publicConfig')} type="plus-square" />
          </Col>
        </Row>
        <Button type="primary" onClick={onValidateForm} loading={submitting}>
          提交
        </Button>
        <Button onClick={onPrev} style={{ marginLeft: 8 }}>
          上一步
        </Button>

        <Modal
          title="设置"
          visible={visible}
          onOk={this.visible}
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}
        >
          {renderConfig()}
        </Modal>
      </Form>
    );
  }
}

export default Step2;
