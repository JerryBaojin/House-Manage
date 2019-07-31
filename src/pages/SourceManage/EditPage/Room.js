import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Skeleton,
  Tag,
  Collapse,
  InputNumber,
  Form,
  Input,
  Button,
  Card,
  Icon,
  Tooltip,
  Cascader,
  Modal,
  Popconfirm,
  Select,
  DatePicker,
  Row,
  Radio,
  Spin,
  Checkbox,
  Col
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Room.less';
const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;

const formItemLayout = {

};

@connect(({sourceConfig,loading})=>({
  updaterooms:loading.effects['loading/updaterooms']
}))
@Form.create()
class Room extends PureComponent {
  state = {
    roomConfig: ['空调', '电视', '床', '书桌', '衣柜', '阳台', '独卫'],
    data:null
  }
  handleSubmit = e => {
    const { dispatch, form,state } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type:"sourceConfig/updaterooms",
          payload:values
        })
      }
    });
  };

  componentWillMount(){
    let data = JSON.parse(localStorage.getItem('e-room'));
 //   localStorage.removeItem('e-room');
    data.rooms = data.rooms.map(val=>({...val,roomConfig:JSON.parse(val.roomConfig)}))
    this.setState({data});
    console.log('mountedMethods......')
  }
  renderStatus = (math) =>{
    return (<Radio key={math} disabled value={math}>{math===0?'未租':(math===1?'已租':'未租')}</Radio>); 
  }
  renderLists = ()=>{
    let pre = [];
    this.state.roomConfig.forEach((val,index)=>{
      pre.push(
        <Checkbox key={index} value={val}>
          {val}
        </Checkbox>
      )
    })
    return pre;
  }

  renderRooms = (data)=>{
    const {
      form:{getFieldDecorator }
    } = this.props;
    let dom = [];
    const poiData = this.state.data;
    data.forEach((val,index)=>{
      dom.push(
        <div key={index}>
           <div style={{borderBottom:"1px dashed gray",fontSize:22}}>
              {poiData.housetype}-{poiData.floorNumber}栋-{poiData.unitNumber}单元-{poiData.roomNumber}{val.name}
          </div>
         <div className={styles.roomDiv}>
            <FormItem {...formItemLayout} label={"出租状态"}>
                {getFieldDecorator(`${val.id}.rentStatus`, {
                          initialValue:val.rentStatus,
                          rules: [
                            {
                              required: true,
                              message: "请输入",
                            }
                          ],
                        })(
                          <Radio.Group>
                            {this.renderStatus(val.rentStatus)}
                          
                            </Radio.Group>
                        )}
            </FormItem>
            <FormItem {...formItemLayout} label={"房间面积"}>
                {getFieldDecorator(`${val.id}.roomArea`, {
                          initialValue:val.roomArea,
                          rules: [
                            {
                              required: true,
                              message: "请输入",
                            }
                          ],
                        })(
                          <Input type="number" style={{ width: 200 }} />
                        )}
            </FormItem> 
        </div>
        {
          val.moneycosts?(
            <div className={styles.roomDiv}>
              <FormItem {...formItemLayout} label={"房屋租金"}>
                    {getFieldDecorator(`${val.id}.moneycosts`, {
                              initialValue:val.moneycosts,
                              rules: [
                                {
                                  required: true,
                                  message: "请输入",
                                }
                              ],
                            })(
                              <InputNumber style={{ width: 200 }} />
                            )}
                </FormItem>  
            </div>
          ):null
           }
          
        <div className={styles.roomDiv}>
           <FormItem {...formItemLayout} label={"房间配置"}>
                          {getFieldDecorator(`${val.id}.roomConfig`,{
                              initialValue:val.roomConfig,
                              rules: [
                                {
                                  required: false,
                                  message: "请输入",
                                }
                              ],
                            })(
                              <Checkbox.Group>
                                  {this.renderLists()}
                              </Checkbox.Group>
                            )}
           </FormItem>
        </div>           
        <div className={styles.roomDiv}>
           <FormItem {...formItemLayout} label={"房源描述"}>
                          {getFieldDecorator(`${val.id}.roomDescription`,{
                              initialValue:val.roomDescription,
                              rules: [
                                {
                                  required: true,
                                  message: "请输入",
                                }
                              ],
                            })(
                                <TextArea
                                style={{width:400}}
                                 rows={4}
                                placeholder="租客更喜欢详细的房源特色、小区商圈、交通情况等描述（建议150字以上）"
                              />
                            )}
           </FormItem>
        </div>
        </div>
      )
    })
    return dom;
  }
  
  render() {
    const {
      form:{getFieldDecorator },
      updaterooms
    } = this.props;
    const  { data } = this.state;
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <Form   style={{ marginTop: 8 }}>
        {this.renderRooms(data.rooms)}
        <Button type="primary" loading={updaterooms} className={styles.center} onClick={this.handleSubmit}>
          提交
        </Button>
      </Form>

    );
  }
}

export default Room;
