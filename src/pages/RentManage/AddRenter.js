
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import {
  notification,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Checkbox,
  Radio,
  Icon,
  Upload,
  Spin,
  Tooltip,
  Modal,
  Row,
  Col
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea,Search } = Input;
const CheckboxGroup = Checkbox.Group;
const dateFormat = 'YYYY-MM-DD';
const RowColLayOut = {
  one:{
    lg:6,
    md:12,
    sm:24
  },
  two:{
    xl:{ span: 6, offset: 2 },
    lg:{ span: 8 },
    md:{ span: 12 },
    sm:24
  },
  three:{
    xl:{ span: 8, offset: 2 },
    lg:{ span: 10 },
    md:{ span: 24 },
    sm:24
  }

}
const formItemLayoutPreOrderMoney = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 10,
  },
};
const __setCostPaying = (datas) =>{
  var count = 0;
    datas.rooms.forEach((value)=>{
    count += value.moneycosts
  })
  return count;
}
@connect(({ rent ,loading})=>({
  uploadUrl:rent.uploadUrl,
  originData:rent.originData,
  data:rent.data,
  preData:rent.form,
  FormSubmit:loading.effects['rent/FormSubmit'],
  getForm:loading.effects['rent/_handleChooseHouseId']
}))
@Form.create()
class AddRenter extends React.Component {
  state = {
    extVisible:false,
    previewVisible: false,
    previewImage: '',
    house:{},
    orderID:null,
    houseId:null,
    shouldLoading:true,
    payway:0,
    costsmoney:0, //租金
    fileList: [
    ],
    extVisible:{
      computedFees:false,
      afixFees:false,
    },
    fees:null
  }

componentDidMount(){
  var orderID=this.getQueryString('orderId');
  var houseId=this.getQueryString('houseId');
if(houseId){
  this.setState({houseId})
}
   if (orderID) {
     this.props.dispatch({
       type:"rent/getPreOrderInfo",
       payload:{orderID},
       callback:()=>{
         this.setState({
           orderID,
           shouldLoading:false
         })
       }
     })
   }else{
     this.setState({
       shouldLoading:false
     })
   }
}
componentWillUnmount(){
  this.props.dispatch({
    type:"rent/initDataForm"
  })
}
static getDerivedStateFromProps(nextprops,oldState){
  const { fees } = nextprops.data;
  var datas;
  if(!nextprops.hasOwnProperty('data'))return null;
  if (nextprops.data.renttype != 0) {
    //整租
    if (oldState.costsmoney != nextprops.data.crentMoney) {
        return {
          oldState,
          fees,
          costsmoney:nextprops.data.crentMoney
        }
    }
  }else{
    if ((datas = __setCostPaying(nextprops.data)) !== oldState.costsmoney ) {
      return {
        oldState,
        fees,
        costsmoney:datas
      }
    }
  }
  return null;
}

getQueryString = (name) =>decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20'));
handlePreview = file => {
  this.setState({
    previewImage: file.url || file.thumbUrl,
    previewVisible: true,
  });
};
handleCancel = () => this.setState({ previewVisible: false });

handleChange = ({ fileList,event  }) => {
  this.setState({ fileList })
};


handleSubmit = e => {
  const { dispatch, form, data } = this.props;
  e.preventDefault();
  form.validateFieldsAndScroll((err, values) => {
    if (!err) {
    //  const  computedDatas = Object.keys(values.fees).map(_val=>data.fees.filter(val=>val.id==values.communityId)[0].data.fees[_val].map((_values,index)=>Object.assign({},_values,{val:values.fees[_val][_values.type]}) ))
    const computedDatas = Object.keys(this.state.fees).map(_val=>this.state.fees[_val].map(val=>Object.assign({},val,{val:values.fees[_val][val.type]})));

      values ={
        ...values,
        fees:{
          afixFees:computedDatas[0],
          computedFees:computedDatas[1]
        }
      }
      values.ext = data.ext;
      values.idcardImgs = this.state.fileList.map(val=>val.response);
    if (this.state.orderID) {
        values.orderID = this.state.orderID
        dispatch({
          type: 'rent/_updateOrder',
          payload: values,
        });
    }else{
      dispatch({
        type: 'rent/submitForm',
        payload: values,
      });
    }

    }
  });
};

handleUUid = (e) =>{
  this.props.dispatch({
    type:"rent/_handleChooseHouseId",
    payload:{uuid:e}
  })
}

handleOnConfirm=()=>{
  const { fixType, fixDatas, fixUnits} = this.refs;
  const inputs = { fixType, fixDatas, fixUnits}

  const __datas = {
    name:fixType.state.value,
    val:fixDatas.state.value,
    units:fixUnits.state.value
  }

  try {
    Object.keys(inputs).forEach(val=>{
      if (!inputs[val].state.value) {
        throw new Error(inputs[val].props.placeholder)
      }
    });
    this.props.dispatch({
      type:"rent/asyncExtParams",
      payload:__datas
    })
    Object.keys(inputs).forEach(val=>{
      this.refs[val].state.value = "";
    });
    this.setState({
      extVisible:false,
    })
  } catch (e) {
    notification.error({
      message: e.message,
    });
  }
}

handleOnConfirmA=(dataTrees)=>{

  if (dataTrees === 'afixFees') {
    var { afixFeesfixType, afixFeesfixDatas, afixFeesfixUnits} = this.refs;
    var inputs = { afixFeesfixType, afixFeesfixDatas, afixFeesfixUnits};
    var __datas = {
      name:afixFeesfixType.state.value,
      val:afixFeesfixDatas.state.value,
      units:afixFeesfixUnits.state.value
    }
  }else{
    var { computedFeesfixType, computedFeesfixDatas, computedFeesfixUnits} = this.refs;
    var inputs = { computedFeesfixType, computedFeesfixDatas, computedFeesfixUnits};
    var __datas = {
      name:computedFeesfixType.state.value,
      val:computedFeesfixDatas.state.value,
      units:computedFeesfixUnits.state.value
    }
  }

  try {
    Object.keys(inputs).forEach(val=>{

      if (!inputs[val].state.value) {

        throw new Error(inputs[val].props.placeholder)
      }
    });
    this.add( dataTrees,__datas,()=>{
      Object.keys(inputs).forEach(val=>{
        this.refs[val].state.value = "";
      });
    });
  } catch (e) {
    notification.error({
      message: e.message,
    });
  }
}

handleFileRemove = (file) =>{
  this.props.dispatch({
    type:"rent/_removeFile",
    payload:{name:file.name}
  })
}

handleCheckBox = (val)=>{
  var count = 0;
  this.props.data.rooms.forEach((value)=>{
    if (val.includes(value.id) ) {
      count += value.moneycosts
    }
  })
  this.setState({
    costsmoney:count
  })
  // return false;
  // if (val.length ===0) {
  //   this.setState({
  //     house:Object.create({})
  //   })
  //
  // }
  //
  // let house = this.props.data.rooms.filter(values=>values.id ==val[0])[0]
  //
  // this.setState({
  //   house
  // })
}
remove = (dataTrees,k) => {
  const { form } = this.props;
  const datas = form.getFieldsValue();
  const key = JSON.parse(JSON.stringify(this.state.fees));
  // can use data-binding to set
  let computedDatas = Object.keys(key).map((val)=>key[val].filter((v,index)=>v.type !==k	));

  this.setState({
    fees: {
      afixFees:computedDatas[0],
      computedFees:computedDatas[1]
    }
  })
  // form.setFieldsValue({
  //   fees: {
  //     afixFees:key.afixFees,
  //     computedFees:key.computedFees
  //   }
  // });
}
add = (type,datas,fn) => {
  const { form } = this.props;
  // can use data-binding to get
  const keys =JSON.parse(JSON.stringify(this.state.fees));
  let currentTYPE = Object.keys(keys[type]).length;
  const newDataFo = {
    type:`ext${(++currentTYPE)-6}`,
    ...datas
  }
  keys[type].push(newDataFo);
  const originData = this.state.extVisible;
  originData[type] = false;
  // can use data-binding to set
  // important! notify form to detect changes
  this.setState({
    fees:keys,
    extVisible:Object.assign({},originData)
  })

  fn();
}


render() {
const { submitting , data , preData, originData, uploadUrl ,getForm , FormSubmit,  } = this.props;
const { extVisible , house , shouldLoading , houseId ,fees} = this.state;
const {
  form: { getFieldDecorator, getFieldValue },
} = this.props;

const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
const { previewVisible, previewImage, fileList } = this.state;
const uploadButton = (
   <div>
     <Icon type="plus" />
     <div className="ant-upload-text">上传</div>
   </div>
 )

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
const disPlayProject = (data) =>{
  if (typeof data !== 'object') return;
  let comPone = [];
  data.forEach((val, key) => {
    comPone.push(
      <Option key={key} value={val.id||val.modelId || val}>
        {val.id}
      </Option>
    );
  });
  return comPone;
}
const renderExtFees = () =>{
  const _preparingDom = [];
  data.ext?null:data.ext = [];
  data.ext.forEach((val,index)=>{
    _preparingDom.push(
      <FormItem key={index}  label={val.name}>
          {getFieldDecorator(`ext[${index}]`, {
            initialValue:val.val,
            rules: [
              {
                required: true,
                message: "请输入"+val.name,
              },
            ],
          })(
              <Input  style={{ width: 100,marginRight:5 }} size="large"  />

          )}
            <span dangerouslySetInnerHTML={{__html: val.units}}></span>

      </FormItem>
    )
  })
  return _preparingDom;
}
//15579054529200
const disabledDate = (current) => {
  // Can not select days before today and today
  if (data.owntype === 'own') {
    return false;
  }
  var dateBetweent = true;
  if(current){
    const _timechar = new Date(current.format()).getTime();
    dateBetweent = data.houseKeepingStart+"000" < _timechar && _timechar <= data.houseKeepingEnd+"000"

  }
  return current && !dateBetweent;
}
const renderTrees =(dataTrees)=>{
  const preDomTrees = [];
  this.state.fees[dataTrees].forEach((val,_index)=>{
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
            <Icon
                style={{marginLeft:5}}
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(dataTrees,val.type)}
              />
      </FormItem>
    )
  })

  preDomTrees.push(
    <div key={'spc1'}>
      <Form.Item >
     </Form.Item>
        <Form.Item  style={{display:!extVisible[dataTrees]?'none':'block'}} {...formItemLayout} className={styles.addArea}>
          <div className={styles.addFormArea}>
            <Input placeholder="请输入类型" ref={`${dataTrees}fixType`} />
            <span style={{marginRight:4}}>:</span>
            <Input placeholder="请输入数据"  ref={`${dataTrees}fixDatas`} />
            <Input placeholder="请输入单位" ref={`${dataTrees}fixUnits`} />
            <Button type="primary" onClick={()=>this.handleOnConfirmA(dataTrees)}>
              确定
            </Button>
          </div>
        </Form.Item>
        <Form.Item key={'spc'} {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={()=>{
            extVisible[dataTrees] = true;
                this.setState({
                  extVisible:Object.assign({},extVisible)
                })
              }
            } style={{ width: '60%' }}>
            <Icon type="plus" /> 添加分类
          </Button>
        </Form.Item>
    </div>
  );


  return preDomTrees;
}
const CheckboxInitialData = ()=>{
  if(!data.hasOwnProperty('rooms'))return [];
  let roomsInitialValue = [];
  if (preData.room_id) {
    roomsInitialValue = preData.room_id
  }else if (data.renttype!=='0') {
    //整租
    roomsInitialValue = data.rooms.map(val=>val.id);
  }else{
    roomsInitialValue =data.rooms.filter(val=>val.rentStatus===1).map(value=>value.id)
  }
  return roomsInitialValue;
}

const roomDom = ()=>{
  const t = [];
  const disabled = data.renttype!=='0'?true:false;
  if (!data.hasOwnProperty('rooms')) {
    return [];
  }
  data.rooms.forEach((val,index)=>{
    t.push(
      <Checkbox defaultChecked={disabled} key={index} disabled ={disabled || val.rentStatus!=0}  value={val.id}>
        {val.name}
      </Checkbox>
    )
  })
  return t;
}
const dataFormatRanger = (time) =>{
  return   moment(moment(Number(time+"000")).format(),dateFormat);
}

const renderAddressInfo = ()=>{
  let str = '';
  if (data.address) {
    data.address.forEach(val=>{
      str += val.name;
    })
    str += data.detailAddr;
  }
  return str;
}

return (
  <Spin size="large" className={styles.alignCenter} spinning={shouldLoading}>
  {shouldLoading?null:(
  <PageHeaderWrapper
    title={"添加租赁"}
    content={"需要详细填写相关信息"}
  >

    <Card bordered={false}>
      <Form   style={{ marginTop: 8 }}>
        <Spin size="large" tip="请稍等..." spinning={getForm || false}>
          <FormItem   {...formItemLayout} label={"请先输入房间id"}>
              {getFieldDecorator(`render.uuid`, {
                initialValue:preData.uuid || houseId || null,
                validateFirst:true,
                validateTrigger:"onBlur",
                rules: [
                  {
                    required: true,
                    message: "请输入",
                  },
                ],
              })(
                <Search
                    disabled={preData.uuid?true:false}
                    onSearch={value =>this.handleUUid(value)}
                    style={{ width: 200 }}
                  />
              )}
          </FormItem>
          <div style={{display:data.uuid?'block':'none'}}>
          <h3>房屋相关信息</h3>
          <Row gutter={16} className={styles.RowCenter}>
            <Col  {...RowColLayOut.one}><div className={styles.dirText}> 房间面积: { data.ProjectName}</div></Col>
            <Col {...RowColLayOut.two}><div className={styles.dirText}> 所属小区: { data.communityName}</div></Col>
            <Col  {...RowColLayOut.three}><div className={styles.dirText}> 所属类型: { data.housetype}</div></Col>
          </Row>
          <Row gutter={16} className={styles.RowCenter}>
            <Col  {...RowColLayOut.one}><div className={styles.dirText}> 房源持有方式: { data.owntype === 'rent'?'收租':'自持'}</div></Col>
            <Col  {...RowColLayOut.two}><div className={styles.dirText}> 位置信息: {renderAddressInfo()}</div></Col>
            <Col {...RowColLayOut.three}><div className={styles.dirText}> 出租类型: { data.renttype === '0'?'合租':'整租'}</div></Col>
          </Row>
          <Row gutter={16} className={styles.RowCenter}>
            <Col  {...RowColLayOut.one}><div className={styles.dirText}> 房间信息: { data.floorNumber?data.floorNumber:'--'}栋{ data.unitNumber?data.unitNumber:'--'}单元{ data.roomNumber?data.roomNumber:'--'}门牌号 { data.houseNumber?data.houseNumber:'--'}室{ data.hallNumber?data.hallNumber:'--'}厅{ data.wcNumber?data.wcNumber:'--'}卫 </div></Col>
            <Col {...RowColLayOut.two}>
            <Form.Item {...formItemLayout} label={"选择房屋"}>
              {getFieldDecorator(`houseNo`, {
                initialValue: CheckboxInitialData(),
                rules: [
                  {
                    required: true,
                    message: '请选择所租的房屋',
                  },
                ],
              })(
                <Checkbox.Group   style={{ width: '100%' }} onChange={(val) => this.handleCheckBox(val)}>
                  {roomDom()}
                </Checkbox.Group>
              )}
            </Form.Item>
            </Col>
            <Col {...RowColLayOut.three}>  {
                data.owntype === 'rent'?(
                  <div className={styles.dirText} > 房源持有时间:
                  <RangePicker
                    style={{width:250}}
                    defaultValue={[dataFormatRanger(data.houseKeepingStart),dataFormatRanger(data.houseKeepingEnd)]}
                    disabled
                    />
                  </div>
                ):null
              }</Col>
          </Row>

          {/*所选房屋相关信息*/}
          {
            house.id?(
              <div>
                <div className={styles.dirText}> 房间面积: { house.roomArea} m<sup>3</sup></div>
                <div className={styles.dirText}> 房屋描述: { house.roomDescription}</div>
                <div className={styles.dirText}> 朝向: { house.direction }</div>
                <div className={styles.dirText}> 公共配置: { data.publicConfig?JSON.parse(data.publicConfig).join(','):''}</div>
                <div className={styles.dirText}> 房间配置: {house.roomConfig?JSON.parse(house.roomConfig).join(','):'' }</div>
              </div>
            ):null
          }
          <h3>租客信息</h3>
          <Row gutter={16} className={styles.RowCenter}>
            <Col  {...RowColLayOut.one}>
              <FormItem  {...formItemLayout} label={"姓名"}>
                  {getFieldDecorator(`render.name`, {
                    initialValue:preData.name,
                    rules: [
                      {
                        required: true,
                        message: "请输入",
                      },
                    ],
                  })(
                      <Input  style={{ width: 150,marginRight:5 }} size="large"  />
                  )}
              </FormItem>
            </Col>
            <Col {...RowColLayOut.two}>
            <FormItem  {...formItemLayout} label={"手机"}>
                {getFieldDecorator(`render.phone`, {
                  initialValue:preData.phone,
                  rules: [
                    {
                      required: true,
                      message: "请输入",
                    },
                  ],
                })(
                    <Input type="number"  style={{ width: 150,marginRight:5 }} size="large"  />
                )}
            </FormItem>
            </Col>
            <Col {...RowColLayOut.three}>
            <FormItem  {...formItemLayout} label={"身份证号"}>
                {getFieldDecorator(`render.idcard`, {
                  initialValue:preData.idcard,
                  rules: [
                    {
                      required: true,
                      message: "请输入",
                    },
                  ],
                })(
                    <Input   style={{ width: 200,marginRight:5 }} size="large"  />
                )}
            </FormItem>
            </Col>
          </Row>

          <Row gutter={16} className={styles.RowCenter}>
            <Col  {...RowColLayOut.one}>
              <div >
                <label style={{float:"left",margin:"0 2% 0 9%"}}>证件照片:</label>
                <div className="clearfix">
                  <Upload
                    accept="images/*"
                    action={uploadUrl}
                    listType="picture-card"
                    fileList={fileList}
                    onRemove={this.handleFileRemove}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 3 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              </div>
            </Col>
            <Col {...RowColLayOut.two}>
              {!preData.preorderMoney?null:(<Form.Item {...formItemLayoutPreOrderMoney} label={'定金'}>
                <InputNumber value={preData.preorderMoney} disabled style={{ width: '100%' }}  />
              </Form.Item>)}
            </Col>
          </Row>

          <h3>租约信息</h3>
          <Row gutter={16} className={styles.RowCenter}>
            <Col  {...RowColLayOut.one}>
              <Form.Item label={'租赁时长'}>
                {getFieldDecorator('rentInfo.data', {
                  rules: [
                    {
                      required: true,
                      message: '请填写房屋租赁时长',
                    },
                  ],
                })(<RangePicker disabledDate={disabledDate}   style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />)}
              </Form.Item>
            </Col>

            <Col {...RowColLayOut.two}>
              <Form.Item label={'租金'}>
                {getFieldDecorator('rentInfo.rentMoney', {
                  initialValue:this.state.costsmoney,
                  rules: [
                    {
                      required: true,
                      message: '请填写租金',
                    },
                  ],
                })(<InputNumber   style={{ width: '100%' }}  />)}
              </Form.Item>
            </Col>
            <Col {...RowColLayOut.three}>
              <Form.Item  label="付款周期">
                {getFieldDecorator('rentInfo.renttype', {
                  initialValue:  "0",
                  rules: [{ required: true, message: '请选择出租方式' }],
                })(
                  <Radio.Group>
                    <Radio key="0" value="0">
                      月付
                    </Radio>
                    <Radio key="1" value="1">
                      季付
                    </Radio>
                    <Radio key="2" value="2">
                      半年付
                    </Radio>
                    <Radio key="3" value="3">
                      年付
                    </Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} className={styles.RowCenter}>
            <Col  {...RowColLayOut.one}>
              <Form.Item label={'押金'}>
                {getFieldDecorator('rentInfo.coMoeny', {
                  rules: [
                    {
                      required: true,
                      message: '请填写押金',
                    },
                  ],
                })(<InputNumber   style={{ width: '100%' }}  />)}
              </Form.Item>
            </Col>
            <Col {...RowColLayOut.two}>

              <Form.Item label={'中介姓名'}>
                {getFieldDecorator('rentInfo.midDogName', {
                  initialValue:preData.midDogName || null,
                })(<Input   style={{ width: '100%' }}  />)}
              </Form.Item>
            </Col>
            <Col {...RowColLayOut.three}></Col>
          </Row>


  <h2>费用配置</h2>
  {!fees?null:(
    <Row >
        <Col span={12}>
            <h3>固定费用</h3>
            {renderTrees("afixFees")}
            <Form.Item {...formItemLayout} label="付款周期">
              {getFieldDecorator('rentInfo.afixFeesPayround', {
                initialValue:  "0",
                rules: [{ required: true, message: '请选择出租方式' }],
              })(
                <Radio.Group >
                  <Radio key="0" value="0">
                    随房租周期收取
                  </Radio>
                  <Radio key="1" value="1">
                    按月收取
                  </Radio>
                </Radio.Group>
              )}
            </Form.Item>
        </Col>
        <Col span={12}>
        <h3>计量费用</h3>
        {renderTrees("computedFees")}

        <Form.Item {...formItemLayout} label="付款周期">
          {getFieldDecorator('rentInfo.computedFeesPayround', {
            initialValue:  "0",
            rules: [{ required: true, message: '请选择出租方式' }],
          })(
            <Radio.Group >
              <Radio key="0" value="0">
                随房租周期收取
              </Radio>
              <Radio key="1" value="1">
                按月收取
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        </Col>
    </Row>
  )}

          <div>
              <div className={styles.formBottom}>
                <br/>
                <Form.Item {...formItemLayout} label="付费模式">
                  {getFieldDecorator('rentInfo.payway', {
                    initialValue:  "0",
                    rules: [{ required: true, message: '请选择付费模式' }],
                  })(
                    <Radio.Group onChange={e=>{
                      e.target.value ==1?this.setState({payway:1}):null
                    }}>
                      <Radio key="0" value="0">
                        按实际费用缴纳
                      </Radio>
                      <Radio key="1" value="1">
                        随着房租周期预付固定金额，退租统一结算
                      </Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                {this.state.payway==1?(
                  <Form.Item  style={{width:"unset"}} label="周期预付">
                  {getFieldDecorator('rentInfo.roundPrePaY', {
                    rules:[{required:true,message:"请输入周期预付金额"}]
                  })(<InputNumber   style={{ width: 150 }}  />)}元
                  </Form.Item>
                ):null}


                {/*额外费用*/}
                {renderExtFees()}
                <div key={'spc1'}>
                  <Form.Item >

                 </Form.Item>
                    <Form.Item  style={{display:!extVisible?'none':'block'}} {...formItemLayout} className={styles.addArea}>
                      <div className={styles.addFormArea}>
                        <Input placeholder="请输入类型" ref={`fixType`} />
                        <span style={{marginRight:4}}>:</span>
                        <Input placeholder="请输入数据"  ref={`fixDatas`} />
                        <Input placeholder="请输入单位" ref={`fixUnits`} />
                        <Button type="primary" onClick={()=>this.handleOnConfirm()}>
                          确定
                        </Button>
                      </div>
                    </Form.Item>
                    <Form.Item key={'spc'} {...formItemLayoutWithOutLabel}>
                      <Button type="dashed" onClick={()=>{
                        this.setState({
                          extVisible:true
                        })
                      }
                    } style={{ width: '60%' }}>
                        <Icon type="plus" /> 添加额外信息项
                      </Button>
                    </Form.Item>
                </div>

              </div>
              <Button type="primary" loading={FormSubmit} style={{margin:"auto",display:"block"}} onClick={this.handleSubmit}>
                提交
              </Button>
            </div>
            </div>
        </Spin>
      </Form>
    </Card>
  </PageHeaderWrapper>
  )}
  </Spin>
);
}
}

export default AddRenter;
