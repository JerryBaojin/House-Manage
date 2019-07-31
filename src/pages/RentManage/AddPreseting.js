
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
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
  Spin,
  Tooltip,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea,Search  } = Input;
const CheckboxGroup = Checkbox.Group;
const dateFormat = 'YYYY-MM-DD';

@connect(({ rent ,loading})=>({
  uploadUrl:rent.uploadUrl,
  originData:rent.originData,
  data:rent.data,
  FormSubmit:loading.effects['rent/submitPreOrderForm'],
  getForm:loading.effects['rent/_handleChooseHouseId']
}))
@Form.create()
class AddPreseting extends React.Component {
  state = {
    extVisible:false,
    previewVisible: false,
    previewImage: '',
    house:{},
    houseId:null,
    fileList: [
    ],
  }

componentWillUnmount(){
  this.props.dispatch({
    type:"rent/initDataForm"
  })
}
componentDidMount(){
  var houseId=this.getQueryString('houseId')
  if(houseId){
    this.setState({
      houseId
    })
  }
  // this.props.dispatch({
  //   type:"rent/getHouse"
  // })
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
    const key = form.getFieldValue('houseNo');
    if (key.length === 0 ) {
      notification.error({
        message: "请选择房屋!",
      });
      return;
    }
  form.validateFieldsAndScroll((err, values) => {
    if (!err) {
      dispatch({
        type: 'rent/submitPreOrderForm',
        payload: values,
      });
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
handleFileRemove = (file) =>{
  this.props.dispatch({
    type:"rent/_removeFile",
    payload:{name:file.name}
  })
}
handleCheckBox = (val)=>{
  return false;
  if (val.length ===0) {
    this.setState({
      house:Object.create({})
    })
    return
  }

  let house = this.props.data.rooms.filter(values=>values.id ==val[0])[0]

  this.setState({
    house
  })
}
render() {
const { submitting , data , originData, uploadUrl ,getForm , FormSubmit,  } = this.props;
const { extVisible , house } = this.state
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
      <FormItem key={index} {...formItemLayout} label={val.name}>
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
    // let currentObjct = data.community.filter(_value=>index === _value.modelId)[0];
    // if( null !== index){
    //   if(  typeof currentObjct.fees== "string"){
    //     currentObjct.fees = JSON.parse(currentObjct.fees);
    //   }
    // }
  data.fees[dataTrees].forEach((val,_index)=>{
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
const CheckboxInitialData = ()=>{
  if(!data.hasOwnProperty('rooms'))return [];
  let roomsInitialValue = [];
 if (data.renttype!=='0') {
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
  <PageHeaderWrapper
    title={"添加租赁"}
    content={"需要详细填写相关信息"}
  >

    <Card bordered={false}>
      <Form   style={{     width: "50%",marginTop: 8 }}>
        <Spin size="large" tip="请稍等..." spinning={getForm || false}>
          <h3>请先输入房间id</h3>
          <FormItem   {...formItemLayout} label={"房屋id"}>
              {getFieldDecorator(`render.uuid`, {
                initialValue:this.state.houseId,
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

                    onSearch={value =>this.handleUUid(value)}
                    style={{ width: 150 }}
                  />
              )}
          </FormItem>

          <div  style={{display:data.uuid?'block':'none'}}>
            <div className={styles.dirText}> 房间面积: { data.area}</div>
            <div className={styles.dirText}> 所属小区: { data.communityName}</div>
            <div className={styles.dirText}> 所属: { data.renttype === '0'?'合租':'整租'}</div>
            <div className={styles.dirText}> 房源持有方式: { data.owntype === 'rent'?'收租':'自持'}</div>
            <div className={styles.dirText}> 位置信息: {renderAddressInfo()}</div>
            <div className={styles.dirText}> 房间信息: { data.floorNumber?data.floorNumber:'--'}栋{ data.unitNumber?data.unitNumber:'--'}单元{ data.roomNumber?data.roomNumber:'--'}门牌号 { data.houseNumber?data.houseNumber:'--'}室{ data.hallNumber?data.hallNumber:'--'}厅{ data.wcNumber?data.wcNumber:'--'}卫 </div>

            {
              data.owntype === 'rent'?(
                <div className={styles.dirText} > 房源持有时间:
                <RangePicker
                  defaultValue={[dataFormatRanger(data.houseKeepingStart),dataFormatRanger(data.houseKeepingEnd)]}
                  disabled
                  />
                </div>
              ):null
            }

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

          </div>
          <div style={{display:data.id?'block':'none'}}>
            <h3>租客信息</h3>
            <FormItem  {...formItemLayout} label={"姓名"}>
                {getFieldDecorator(`render.name`, {
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
            <FormItem  {...formItemLayout} label={"手机"}>
                {getFieldDecorator(`render.phone`, {
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

            <FormItem  {...formItemLayout} label={"身份证号"}>
                {getFieldDecorator(`render.idcard`, {
                  rules: [
                    {
                      required: true,
                      message: "请输入",
                    },
                  ],
                })(
                    <Input   style={{ width: 150,marginRight:5 }} size="large"  />
                )}
            </FormItem>

            <Form.Item {...formItemLayout} label={'定金'}>
              {getFieldDecorator('rentInfo.preorderMoney', {
                rules: [
                  {
                    required: true,
                    message: '请填写定金',
                  },
                ],
              })(<InputNumber style={{ width: 150,marginRight:5 }} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label={'中介姓名'}>
              {getFieldDecorator('rentInfo.midDogName', {
              })(<Input   style={{ width: 150 }}  />)}
            </Form.Item>
            <Button type="primary" loading={FormSubmit} onClick={this.handleSubmit}>
              提交
            </Button>
            </div>
        </Spin>
      </Form>
    </Card>
  </PageHeaderWrapper>
);
}
}

export default AddPreseting;
