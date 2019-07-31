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
  Spin,
  Col
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RoomModel from '@/components/RoomModel';
import styles from './style.less';
const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};


@connect(({sourceConfig,loading})=>({
  step:sourceConfig.step,
  lists:sourceConfig.lists,
  fetchingDatas:loading.effects['sourceConfig/search'],

}))
@Form.create()
class Center extends PureComponent {
  state = {

  }
  componentDidMount(){
    if (this.props.step.community.length ===0) {

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
    this.props.dispatch({
      type:"sourceConfig/search",
      payload:{}
    })
  }

  // componentWillUnmount(){
  //   this.props.dispatch({
  //     type:"sourceConfig/resetForm"
  //   })
  // }

  handleSubmit = e => {
    const { dispatch, form,state } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let are = this.state.selectedAddressOptions.map((val,index)=>{
          return {
            name:val.label,
            value:val.value
          }
        })
        values.address = are;
        const { address , chargConfig,communityName , detailsAddress ,...fees } = values;
        //
        const  computedDatas = Object.keys(fees).map(val=>this.props.state.models[chargConfig].model[val].map((values,index)=>Object.assign({},values,{val:fees[val][values.type]}) ))
        const payload ={
          fees:{
            afixFees:computedDatas[0],
            computedFees:computedDatas[1]
          },
          modelId:state.models[this.state.index].id,
          address,
          communityName,
          detailsAddress
        }
        dispatch({
          type: 'sourceConfig/addCommunity',
          payload,
          callback:()=>{
            this.setState({
              index:null
            })
            form.resetFields();
          }
        });
      }
    });
  };

  getFields() {
    const { getFieldDecorator } = this.props.form;
    const { step } = this.props;
    if (this.props.step.community.length ===0)return [];
    const children = [];
    const  data = [{
        type:"projectId",
        name:"项目名称",
        value:step.project.map(val=>({id:val.id,label:val.ProjectName}))
      },{
        type:"communityId",
        name:"小区名称",
        value:step.community.map(val=>({id:val.id,label:val.communityName}))
      },
      {
        type:"rentStatus",
        name:"房间状态",
        value:[
          {
            id:1,
            label:"未租"
          },
          {
            id:2,
            label:"已租"
          },
          {
            id:3,
            label:"已预订"
          }
        ]
      }
  ]
  const displayOptions = (lists)=>lists.map((val,index)=>(<Option key={val.id} value={val.id ||val.value} >{val.label}</Option>));
    data.forEach((val,index)=>{
      children.push(
        <Col span={3} key={index} style={{padding:0,margin:0}} >
          <Form.Item {...formItemLayout} key={val.type} label={val.name}>
            {getFieldDecorator(`${val.type}`, {
              initialValue:"*"
            })(
              <Select style={{ width: 100 }}>
                <Option value={"*"}>全部</Option>
                {displayOptions(val.value)}
              </Select>
            )}
          </Form.Item>
        </Col>,
      );
    })
    //时间
    children.push(
      <Col span={5} key={'time1'} >
      <Form.Item  {...formItemLayout} label={'录入时间'}>
        {getFieldDecorator('Indate')(
          <RangePicker   style={{ width:200 }} placeholder={['开始时间', '结束时间']} />
        )}
      </Form.Item>
      </Col>
    )
    children.push(
      <Col span={5} key={'time'} >
      <Form.Item  {...formItemLayout} label={'起租时间'}>
        {getFieldDecorator('Rentdate')(
          <RangePicker   style={{ width:200 }} placeholder={['开始时间', '结束时间']} />
        )}
      </Form.Item>
      </Col>
    )
    children.push(
        <Col span={5} key={'time2'} >
          <Button type="primary" onClick={()=>this.handleSearch()} >
            搜索
          </Button>
        </Col>
    )
    return children;
  }

  handleSearch = () => {

    this.props.form.validateFields((err, values) => {
      //去除所有**
      let formPayload = {};
      Object.keys(values).forEach((val)=>{
        if (values[val] !=="*") {
          formPayload[val] = values[val];
        }
      })
      if (formPayload.rentStatus && formPayload.rentStatus !='*') {
        formPayload.rentStatus = formPayload.rentStatus-1;
      }
      this.props.dispatch({
        type:"sourceConfig/search",
        payload:formPayload
      })
    });
  };
  DeleteRent = (params)=>{
    this.props.dispatch({
      type:"sourceConfig/DeleteRent",
      payload:params,
      callback:()=>{
       this.handleSearch() 
      }
    })
  }
  checkBack = (params)=>{
    this.props.dispatch({
      type:"sourceConfig/checkBack",
      payload:params,
      callback:()=>{
       this.handleSearch() 
      }
    })
  }
  render() {
    const { fetchingDatas ,lists } = this.props



    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const renderRoomModel = (datas) =>datas.map((val,index)=>(<RoomModel checkBack={this.checkBack} DeleteRent={this.DeleteRent} key={index} data={val}/>))
    const renderLists=()=>{
      const lists = this.props.lists;
      let virtualLists = [];
      Object.keys(lists).forEach((val,key)=>{
        virtualLists.push(
          <div key={key} className={styles.lists}>
            <div>
              <div className={styles.content}>
                <p>{val}层</p>
                <p>{lists[val].length}间</p>
              </div>
            </div>
            <div>
              {renderRoomModel(lists[val])}
            </div>
        </div>
        )
        });
        return virtualLists;
    }


    return (
      <PageHeaderWrapper
        title="房源管理中心"
        content=" "
      >
      <Spin spinning={fetchingDatas}>
        {
          this.props.step.community.length ===0?(
            <div style={{textAlign:'center'}}>暂无数据</div>
          ):(
            <div>
              <div>
                <Card>
                  <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                      <Row  className={styles.rows} gutter={24}>{this.getFields()}</Row>


                    </Form>
                  </Card>
              </div>
              <div>
                <Card bordered={false} className={styles.center}>
                    {/*componet*/}
                    {renderLists()}

                </Card>
              </div>
            </div>
          )
        }
        
      </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default Center;
