import React, { Fragment, useState } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  Divider,
  Radio,
  DatePicker,
  InputNumber,
  Modal,
  notification,
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import styles from './style.less';
const { RangePicker } = DatePicker;
const { Option } = Select;
const InputGroup = Input.Group;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ sourceConfig }) => ({
  data: sourceConfig.step,
  cacheData:sourceConfig.form,
  models:sourceConfig.models
}))
@Form.create()
class Step1 extends React.PureComponent {
  state = {
    _rentType:0,
    renttype: "0",
    index:null,
    owntype: 1,
  };
  componentDidMount(){
    if (this.props.data.community.length ===0) {
      this.props.dispatch({
        type:"sourceConfig/getCurrentModels"
      })
      this.props.dispatch({
        type:"sourceConfig/getproject"
      })
      this.props.dispatch({
        type:"sourceConfig/getcommunity"
      })
    }

  }
  handleChangeType = key => {
    let owntype;
    key.target.value == 'rent' ? owntype = 1 : owntype = 0;
    this.setState({ owntype });
  };

  handleProjectChange = (index)=>{
    this.setState({index});
  }
  disPlayProject(data,tag = null) {
    if (typeof data !== 'object') return;
    let comPone = [];

    data.forEach((val, key) => {
      if (tag==1) {
        comPone.push(
          <Option key={key} value={val.id}>
            {val.communityName}
          </Option>
        );
      }else{
        comPone.push(
          <Option key={key} value={val.modelId||val.id || val}>
            {val.ProjectName || val.communityName ||val.modelName ||val}
          </Option>
        );
      }

    });
    return comPone;
  }

  handleTypeChange = (e)=>{
    this.setState({
      _rentType:e.target.value
    })
  }

  _renderModels(models){
        let comPone = [];
        models.forEach((val, key) => {
          comPone.push(
            <Option key={key} value={val.id}>
              {val.modelName}
            </Option>
          );
        });
        return comPone;
  }

  render() {
    const { owntype,index } = this.state;
    const { form, dispatch, data, models, cacheData} = this.props;
    const { getFieldDecorator, validateFields } = form;
    // if(cacheData.owntype=== 'rent'){
    //   this.setState({owntype:1})
    // }else if (  cacheData.owntype=== 'own') {
    //     this.setState({owntype:0})
    // }

    const onValidateForm = () => {
      validateFields((err, values) => {
          if (!err) {
            // if (owntype === 1) {
            //     values.data=[new Date(values.date[0].format()).getTime(),new Date(values.date[1].format()).getTime()];
            // }
            //先找到对应小区model

            const  computedDatas = Object.keys(values.fees).map(_val=>this.props.models.filter(val=>val.id==values.modelId)[0].model[_val].map((_values,index)=>Object.assign({},_values,{val:values.fees[_val][_values.type]}) ))

            values ={
              ...values,
              fees:{
                afixFees:computedDatas[0],
                computedFees:computedDatas[1]
              }
            }

          dispatch({
            type: 'sourceConfig/submitStepOne',
            payload: values,
          });
          //  router.push('/sourcemanage/step-form/confirm');
        } else {
          notification.error({
            message: '请填写房源信息!',
          });
        }
      });
    };

    const renderTrees =(dataTrees)=>{
      if(null === index && !cacheData.modelId){
        return [];
      }
        const preDomTrees = [];
        const dataOrigin = cacheData.modelId?cacheData.fees:models.filter((_value,idx)=>index === _value.id)[0].model;
        console.log(dataOrigin)
        dataOrigin[dataTrees].forEach((val,_index)=>{
        preDomTrees.push(
          <FormItem key={_index} {...formItemLayout} label={val.name}>
              {getFieldDecorator(`fees.${dataTrees}[${val.type}]`, {
                initialValue:val.val,
                rules: [
                  {
                    required: true,
                    message: "请输入"+val.name,
                  },
                ],
              })(
                  <InputNumber  style={{ width: 100,marginRight:5 }} size="large"   placeholder={val.name} />

              )}
                <span dangerouslySetInnerHTML={{__html: val.units}}></span>

          </FormItem>
        )
      })

      return preDomTrees;
    }
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} >
          <Form.Item {...formItemLayout} label="所有方式">
            {getFieldDecorator('owntype', {
              initialValue: cacheData.owntype?cacheData.owntype:'rent',
              rules: [{ required: true, message: '请选择所有方式' }],
            })(
              <Radio.Group
                onChange={key => {
                  this.handleChangeType(key);
                }}
              >
              <Radio key="1" value="rent">
                收租
              </Radio>
                <Radio key="0" value="own">
                  自持
                </Radio>

              </Radio.Group>
            )}
          </Form.Item>
          { cacheData.owntype?(cacheData.owntype === ' rent'?true:false):(owntype == 1?true:false) ? (
            <div>
            <Form.Item {...formItemLayout} label={'业主姓名'}>
              {getFieldDecorator('proprietorName', {
                initialValue: cacheData.proprietorName ,
                rules: [
                  {
                    required: true,
                    message: '请填写业主姓名',
                  },
                ],
              })(
                <Input placeholder="业主姓名" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={'业主电话'}>
              {getFieldDecorator('proprietorPhone', {
                initialValue: cacheData.proprietorPhone ,
                validateFirst:true,
                validateTrigger:"onBlur",
                rules: [
                  {
                    required: true,
                    message: '请填写业主电话',
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: "手机格式错误",
                  }
                ],
              })(
                <Input type="number" placeholder="业主电话" />
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label={'房屋持有时间'}>
              {getFieldDecorator('data', {
                initialValue:cacheData.data?[moment(cacheData.data[0], "YYYY-MM-DD"), moment(cacheData.data[1], "YYYY-MM-DD")]:null,
                rules: [
                  {
                    required: true,
                    message: '请填写房屋持有时间',
                  },
                ],
              })(<RangePicker   style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label={'收租租金'}>
              {getFieldDecorator('rentPrice', {
                initialValue: cacheData.rentPrice ,
                rules: [
                  {
                    required: true,
                    message: '请填写租金价格',
                  },
                ],
              })(<Input style={{ width: 100 }} type="number" placeholder="租金" />
              )}元/月
            </Form.Item>
            <Form.Item {...formItemLayout} label={'空置时长'}>
              {getFieldDecorator('emptySettingTime', {
                initialValue:cacheData.emptySettingTime,
              })(
                <Select  style={{ width: 100 }}>
                  {this.disPlayProject([0,1,2,3,4,5,6,7,8,9,10,11,12])}
                </Select>
              )}个月
            </Form.Item>
            </div>
          ) : null}

          <Form.Item {...formItemLayout} label="选择项目">
            {getFieldDecorator('projectId', {
              initialValue:cacheData.projectId,
              rules: [
                {
                  required: true,
                  message: '请选择项目',
                },
              ],
            })(
              <Select  style={{ width: 100 }}>
                {this.disPlayProject(data.project)}
              </Select>
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="选择小区">
            {getFieldDecorator('communityId', {
              initialValue:cacheData.communityId,
              rules: [
                {
                  required: true,
                  message: '请选择小区',
                },
              ],
            })(
              <Select  style={{ width: 100 }}>
                {this.disPlayProject(data.community,1)}
              </Select>
            )}
          </Form.Item>
         
            
          <Form.Item {...formItemLayout} label="选择模板">
            {getFieldDecorator('modelId', {
              initialValue:cacheData.modelId,
              rules: [
                {
                  required: true,
                  message: '选择模板',
                },
              ],
            })(
              <Select onChange={this.handleProjectChange} style={{ width: 100 }}>
                {this._renderModels(models)}
              </Select>
            )}
          </Form.Item>

          {index ===null && !cacheData.modelId?null:(
            <div className={styles.config}>
              <h2>费用配置</h2>
              <br/>
              <h3>固定费用</h3>
              {renderTrees("afixFees")}

              <h3>计量费用</h3>
              {renderTrees("computedFees")}
            </div>
          )}

          <Form.Item {...formItemLayout} label="出租方式">
            {getFieldDecorator('renttype', {
              initialValue: cacheData.renttype || "0",
              rules: [{ required: true, message: '请选择出租方式' }],
            })(
              <Radio.Group onChange={this.handleTypeChange}>
                <Radio key="0" value="0">
                  合租
                </Radio>
                <Radio key="1" value="1">
                  整租
                </Radio>
              </Radio.Group>
            )}
          </Form.Item>
            { this.state._rentType == 0 && !cacheData._rentType?null:(
                <Form.Item {...formItemLayout} label={'出租租金'}>
                  {getFieldDecorator('crentMoney', {
                    initialValue: cacheData.crentMoney ,
                    rules: [
                      {
                        required: true,
                        message: '请填写出租租金价格',
                      },
                    ],
                  })(<Input style={{ width: 100 }} type="number" placeholder="出租租金" />
                  )}元/月
              </Form.Item>
            )}
          

          <Form.Item {...formItemLayout} label="房源类型">
            {getFieldDecorator('housetype', {
              initialValue: cacheData.housetype,
              rules: [{ required: true, message: '请选择房源类型' }],
            })(
              <Select placeholder="请选择">
              {this.disPlayProject(data.housetype)}
              </Select>
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label={'栋(楼号)'}>
            {getFieldDecorator('floorNumber', {
              initialValue: cacheData.floorNumber,
              rules: [
                {
                  required: true,
                  message: '请填写房屋',
                },
              ],
            })(<Input placeholder="栋" />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label={'单元号'}>
            {getFieldDecorator('unitNumber',{  initialValue: cacheData.unitNumber})(<Input placeholder="(选填)" />)}
          </Form.Item>

          <Row style={{ marginBottom: '24px' }}>
            <Col span={5} className={styles.houses + ' ' + 'ant-form-item-label'}>
              房源信息<span className={styles.dot}>:</span>
            </Col>
            <Col span={19} className={'ant-form-item-control-wrapper'}>
              <InputGroup>
                {getFieldDecorator('roomNumber', {
                  initialValue: cacheData.roomNumber,
                  rules: [
                    {
                      required: true,
                      message: '请输入房间号',
                    },
                  ],
                })(
                  <Input
                    type="number"
                    style={{ width: 90, textAlign: 'center' }}
                    placeholder="房间号"
                  />
                )}
                <Input
                  style={{
                    width: 30,
                    borderLeft: 0,
                    pointerEvents: 'none',
                    backgroundColor: '#fff',
                  }}
                  placeholder="~"
                  disabled
                />
                {getFieldDecorator('houseNumber', {
                  initialValue:cacheData.houseNumber,
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(
                  <Input
                    type="number"
                    style={{ width: 70, textAlign: 'center', borderLeft: 0 }}
                    placeholder="房"

                    max={5}
                  />
                )}
                <Input
                  style={{
                    width: 30,
                    borderLeft: 0,
                    pointerEvents: 'none',
                    backgroundColor: '#fff',
                  }}
                  placeholder="~"
                  disabled
                />
                {getFieldDecorator('hallNumber', {
                  initialValue:cacheData.hallNumber,
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(
                  <Input
                    type="number"
                    style={{ width: 70, textAlign: 'center', borderLeft: 0 }}
                    placeholder="厅"
                  />
                )}
                <Input
                  style={{
                    width: 30,
                    borderLeft: 0,
                    pointerEvents: 'none',
                    backgroundColor: '#fff',
                  }}
                  placeholder="~"
                  disabled
                />
                {getFieldDecorator('wcNumber', {
                  initialValue:cacheData.wcNumber,
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(
                  <Input
                    type="number"
                    style={{ width: 70, textAlign: 'center', borderLeft: 0 }}
                    placeholder="卫"
                  />
                )}
              </InputGroup>
            </Col>
          </Row>
          <Form.Item {...formItemLayout} label={'建筑面积'}>
            {getFieldDecorator('area', {
              initialValue:cacheData.area,
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<Input type="number" placeholder="请输入" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label={'总楼层数'}>
            {getFieldDecorator('dcNumber', {
              initialValue:cacheData.dcNumber,
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<Input type="number" placeholder="请输入" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label={'所在层数'}>
            {getFieldDecorator('currentDcNumber', {
              initialValue:cacheData.currentDcNumber,
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<Input type="number" placeholder="请输入" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label={'电梯房'}>
            {getFieldDecorator('hasElevator', {
              initialValue:cacheData.hasElevator || '1',
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(
              <Select style={{ width: 100 }}>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>
            )}
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
              下一步
            </Button>
          </Form.Item>
        </Form>



        <Divider style={{ margin: '40px 0 24px' }} />

      </Fragment>
    );
  }
}

export default Step1;
