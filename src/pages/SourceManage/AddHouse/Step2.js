import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Alert,
  InputNumber,
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

@connect(({ sourceConfig, loading }) => ({
  submitting: loading.effects['sourceConfig/submitStepTwo'],
  data: sourceConfig.step,
  step1:sourceConfig.form
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
    houseCount: [],
    currentClickIndex:null,
    settingType:null,
    houseNumber: null,
    modelData:new Map()
  };
  handleClick(type,i=null) {
    this.setState({
      visible:true,
      currentClickIndex:i,
      settingType:type
    })
  }
  handleCheckBox( val , key){
    const { modelData } = this.state
    modelData.set(key,val)
    this.setState({
      modelData:modelData
    })
  }
  handleTextAreaChange(val,key){
    // const { getFieldDecorator } = this.props.form;
    // getFieldDecorator(key, { initialValue: val.target.value });
    const { modelData } = this.state
    modelData.set(key,val.target.value)
    this.setState({
      modelData:modelData
    })
  }
  componentWillMount(){
    if (!this.props.step1.hasOwnProperty('hasElevator')) {
      router.push('/AddHouse/info')
    }
  }
  componentDidMount(){
    const EI = ['A', 'B', 'C', 'D', 'E'];
    let _a = [];
    for (let i = 0; i <   this.props.step1.houseNumber ; i++) {
      _a[i] = {
        val:EI[i],
        key:i
      };
    }
    this.setState({houseCount:_a})

  }
  handleModelConfirm(type){

    this.setState({
      settingType:null
    })
  }
  render() {
    const { form, data, dispatch, submitting, step1 } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { height, houseNumber, modelData, houseCount,type, visible, publicConfig, roomConfig } = this.state;
    // this.setState({
    //   height:42 * data.form.houseNumber+"px"
    // })

    const onPrev = () => {
          window.history.back()
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {

        if (!err) {
          //添加state的数据
          values.publicConfig = modelData.get("publicConfig");

          values.FORM.forEach((val,index)=>{
            values.FORM[index].roomConfig= modelData.get(`FORM[${index}].roomConfig`);
            values.FORM[index].roomDescription = modelData.get(`FORM[${index}].roomDescription`);
          })

          dispatch({
            type: 'sourceConfig/submitStepTwo',
            payload: {...step1,values},
          });
        } else {
          this.setState({
            height: '122px',
          });
        }
      });
    };
    const renderLists = (number) => {
      if (!number && !(number instanceof Array)) {
        return
      }
      let tempDomStructor = [];

      const preparState = [];
      number.forEach((val,i)=>{
        tempDomStructor.push(
          <Row key={val.key} className={styles.tableList} style={{ width: '120.3%' }}>
            <Col span={4}>
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].name`, {
                  rules: [
                    {
                      required: true,
                      message: '请填写',
                    }
                  ],
                })(
                  <div>
                    <Button
                      onClick={({ nc = val.val }) => {
                        this.setState({
                          houseCount: number.filter(value => nc !== value.val),
                        });
                      }}
                      type="primary"
                      icon="delete"
                    />
                    {val.val}
                    <Input  placeholder="房间名" />
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
                    <InputNumber type="name" placeholder="" />
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
                )}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].moneycosts`, {
                  rules: [
                    {
                      required:step1.renttype == 1?false: true,
                      message: '请填写租金',
                    },
                  ],
                })(
                    <InputNumber disabled={step1.renttype == 1} placeholder="" />
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item className={styles.marginUnset}>
                {getFieldDecorator(`FORM[${i}].rentStatus`, {
                  initialValue: '0',
                  rules: [
                    {
                      required: true,
                      message: '请选择状态',
                    },
                  ],
                })(
                    <Select disabled={step1.renttype == 1}>
                      <Option value="1">在租</Option>
                      <Option value="0">未租</Option>
                    </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={2}>
              <Icon className={styles.pointer} onClick={()=>this.handleClick('roomDescription',i)} type="plus-square" />
            </Col>
            <Col span={4}>
              <Icon className={styles.pointer} onClick={()=>this.handleClick('roomConfig',i)} type="plus-square" />
            </Col>


          </Row>
        );
      })



      return tempDomStructor;
    };

    const renderConfig = type => {
      const virtualPreDom = [];
      if(!type){
        return [];
      }
      if (type === 'publicConfig' || type === 'roomConfig') {
        const beforeSetDom = ()=>{
          let groups = [];
          this.state[type].forEach((val,index)=>
          {groups.push(
              <Checkbox key={index} value={val}>
                {val}
              </Checkbox>
          )})
          return groups;
        }
        let _key=null;
        type ==='publicConfig'?_key='publicConfig':_key=`FORM[${this.state.currentClickIndex}].${type}`
        virtualPreDom.push(
              <Checkbox.Group key={'1'} defaultValue={this.state.modelData.get(_key)} style={{ width: '100%' }} onChange={(val) => this.handleCheckBox(val,_key)}>
                {beforeSetDom()}
              </Checkbox.Group>
              );
      } else {
        virtualPreDom.push(
            <TextArea
              key={'2'}
              defaultValue={this.state.modelData.get(`FORM[${this.state.currentClickIndex}].${type}`) }
              onChange={(val)=>this.handleTextAreaChange(val,`FORM[${this.state.currentClickIndex}].${type}`)}
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
          <Col span={4}>房间名称</Col>
          <Col span={2}>房间面积(平方米)</Col>
          <Col span={2}>朝向</Col>
          <Col span={2}>租金</Col>
          <Col span={4}>出租状态</Col>
          <Col span={2}>房间描述</Col>
          <Col span={4}>房间配置</Col>
          <Col span={2}>公共配置</Col>
        </Row>

        <Row className={styles.fullContainer}>
          <Col span={2} style={{ border: 'none' }}>
            {step1.floorNumber}--{step1.roomNumber}
          </Col>
          <Col span={20} style={{ overflow: 'hidden' }}>
            {renderLists(houseCount)}
          </Col>
          <Col span={2} style={{ border: 'none' }}>
            <Icon onClick={()=>this.handleClick('publicConfig')} type="plus-square" />
          </Col>
        </Row>
        <div style={{margin:"20px auto",textAlign:"center"}}>
            <Button type="primary" onClick={onValidateForm} loading={submitting}>
              提交
            </Button>
            <Button onClick={onPrev} style={{ marginLeft: 8 }}>
              上一步
            </Button>
        </div>
        <Modal
          title={this.state.settingType==='roomDescription'?'房间描述':'设置'}
          visible={this.state.settingType!=null}
          onOk={()=>this.handleModelConfirm(this.state.settingType)}
          onCancel={() => {
            this.setState({
              settingType:null
            });
          }}
        >
          {renderConfig(this.state.settingType)}
        </Modal>
      </Form>
    );
  }
}

export default Step2;
