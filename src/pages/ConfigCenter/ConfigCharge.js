import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  InputNumber,
  Modal,
  Collapse,
  Form,
  Input,
  Button,
  Card,
  Icon,
  Tooltip,
  notification,
  Cascader
} from 'antd';
import geographic from '@/utils/geographic';
import EditableLinkGroup from '@/components/EditableLinkGroup';
import Link from 'umi/link';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
const Panel = Collapse.Panel;

const FormItem = Form.Item;

@connect(({ config, loading }) => ({
  config,
  submitting: loading.effects['config/chargeConfig'],
}))
@Form.create()
class ConfigCharge extends PureComponent {
  state={
    visible:false,
    currentIndex:null,
    currentDispalyModel:null,
    currentSubmitType:1, //1新增,2修改
    extVisible:{
      computedFees:false,
      afixFees:false,
    },
    currentId:null
  }
  componentDidMount(){
    this.props.dispatch({
      type:"config/getCurrentModels"
    })
  }
  handleRemove=(e,index,id)=>{
    e.stopPropagation()
    this.props.dispatch({
      type:"config/configDelete",
      payload:{index,id}
    })
  }
  // handleRemoveModel(){
  //   this.props.dispatch({
  //     type:"config/configDelete",
  //     payload:{
  //       index:currentIndex,
  //       id:currentId
  //     }
  //   })
  // }
  //form 添加与删除

  remove = (dataTrees,k) => {
    const { form } = this.props;
    const key = form.getFieldValue('keys');
    delete key.modelName;
    // can use data-binding to set
    let computedDatas = Object.keys(key).map((val)=>key[val].filter((v,index)=>v.type !==k	));
    form.setFieldsValue({
      keys: {
        afixFees:computedDatas[0],
        computedFees:computedDatas[1]
      }
    });
  }


  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const { modelName } = values;
      delete values.modelName;
      delete values.keys.modelName;
      values.keys = {
        afixFees:values.keys.afixFees,
        computedFees:values.keys.computedFees
      }

      if (!err) {
        Object.keys(values.keys).forEach(val=>{
          //type 2
          values.keys[val].forEach((value,index)=>{
              values.keys[val][index].val = values[val][value.type]

          })
        })
        dispatch({
          type: 'config/chargeConfig',
          payload: {...values.keys,modelName,id:this.state.currentId,index:this.state.currentIndex},
          callback:(res)=>{
            this.handleMoDalCancel()
          }
        });

      }
    });
  };

  handleAddModal(){
    this.setState({
      currentId:null,
      currentIndex:null,
      currentSubmitType:1,
      currentDispalyModel:null,
      visible:true
    })
    this.props.form.resetFields();
  }

  showModel=(val,index)=>{
    this.props.form.resetFields('modelName');
    this.setState({
      currentIndex:index,
      currentId:val.id,
      currentSubmitType:0,
      currentDispalyModel:{...val.model,modelName:val.modelName},
      visible:true
    })
  }
  handleMoDalCancel=()=>{
    this.setState({
      visible:false
    })
  }
  add = (type,datas,fn) => {
    const { form } = this.props;
    // can use data-binding to get
    const data = form.getFieldsValue();
    const keys = form.getFieldValue('keys');
    let currentTYPE = keys[type].length;
    const newDataFo = {
      type:`ext${(++currentTYPE)-6}`,
      ...datas
    }
    keys[type].push(newDataFo);

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys,
    });
    const originData = this.state.extVisible;
    originData[type] = false;
    this.setState({
      extVisible:Object.assign({},originData)
    })
    fn();
  }

  render() {
    const { submitting} = this.props;
    const { extVisible,currentDispalyModel } =this.state;
    const {
      form: { getFieldDecorator, getFieldValue ,resetFields },
    } = this.props;
    let feesConfig = {
      afixFees:[
          {
            type:"material",
            name:"物管费",
            val:"",
            units:"元/m<sup>2</sup>"
          },
          {
            type:"AIDS",
            name:"宽带费",
            val:"",
            units:"元/月"
          },
          {
            type:"service",
            name:"服务费",
            val:"",
            units:"元/月"
          },
          {
            type:"clean",
            name:"清洁费",
            val:"",
            units:"元/月"
          },
          {
            type:"elevator",
            name:"电梯费",
            val:"",
            units:"元/月"
          },
          {
            type:"cenralHeating",
            name:"暖气费",
            val:"",
            units:"元/月"
          }],
      computedFees:[
        {
          type:"water",
          name:"水费",
          val:"",
          units:"元/方"
        },
        {
          type:"gas",
          name:"气费",
          val:"",
          units:"元/方"
        },
        {
          type:"electron",
          name:"电费",
          val:"",
          units:"元/度"
        }
      ]
    }
    const formItemLayoutWithOutLabel = {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
          },
        };
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
    if (currentDispalyModel) {
        feesConfig ={...feesConfig,...currentDispalyModel};
    }
    getFieldDecorator('keys', { initialValue: feesConfig });
    const keys = getFieldValue("keys");
    const renderTrees =(dataTrees)=>{
      const preDomTrees = [];
      keys[dataTrees].forEach((val,index)=>{
        preDomTrees.push(
          <Form.Item key={index} {...formItemLayout} label={val.name}>
              {getFieldDecorator(`${dataTrees}[${val.type}]`, {
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
          </Form.Item>
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
                <Button type="primary" onClick={()=>handleOnConfirm(dataTrees)}>
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
    const  handleOnConfirm=(dataTrees)=>{

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
    return (
      <PageHeaderWrapper
        title="收费项目"
        content="配置收费相关信息"
      >
        <Card
          style={{ marginBottom: 24 }}
          title="查看配置模板 / 添加配置模板"
          bordered={false}
          bodyStyle={{ padding: 0 }}
        >
          <EditableLinkGroup handleRemove={this.handleRemove} showInfo={this.showModel} onAdd={() =>this.handleAddModal()} links={this.props.config.models} linkElement={Link} />
        </Card>

        <Modal
          title="费用配置"
          visible={this.state.visible}
          loading={submitting}
          onOk={this.handleSubmit}
          onCancel={this.handleMoDalCancel}
        >

        <Form onSubmit={this.handleSubmit}>
        <Form.Item key={'spc'} {...formItemLayout} label={'模板名'}>
          {getFieldDecorator("modelName",{
            initialValue:currentDispalyModel?currentDispalyModel.modelName:null,
            rules:[{
              required:true,
              message:"请填写模板名称"
            }]
          })(
            <Input placeholder="请输入模板名称" />
          )}
        </Form.Item>
          <h3>固定费用</h3>
          {renderTrees("afixFees")}

          <h3>计量费用</h3>
          {renderTrees("computedFees")}



        </Form>
       </Modal>



      </PageHeaderWrapper>
    );
  }
}

export default ConfigCharge;
