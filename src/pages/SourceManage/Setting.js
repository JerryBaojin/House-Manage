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
  Select
} from 'antd';
import geographic from '@/utils/geographic';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
const Panel = Collapse.Panel;
const { Option } = Select;
const FormItem = Form.Item;


@connect(({sourceConfig, loading }) => ({
  state:sourceConfig,
  fetchDatas:loading.effects['sourceConfig/getCurrentModels'],
  deleteLists:loading.effects['sourceConfig/deleteListsMeta'],
  submitPro:loading.effects['sourceConfig/addProject'],
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class Setting extends PureComponent {
  state = {
    communityVisible:false,
    currentCommunity:{},
    index:null,
    selectedAddressOptions:[]
  }
  componentDidMount(){
    if (this.props.state.step.community.length ===0) {
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
  Cascaderselected=(value,selectedOptions)=>{
    this.setState({
      selectedAddressOptions:selectedOptions
    })
  }
  componentWillUnmount(){
    this.props.dispatch({
      type:"sourceConfig/resetForm"
    })
  }
  handleDeleteC = () =>{

  }
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
        const payload ={
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

  addProject = e => {
    const {projectname} = this.refs;
    this.props.dispatch({
      type:"sourceConfig/addProject",
      payload:{ProjectName:projectname.state.value}
    })
      projectname.state.value = "";
  }
  handleProjectChange = (index)=>{
      this.setState({index})
  }
  add = (type,datas,fn) => {
    const { form } = this.props;
    // can use data-binding to get
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

  remove = (dataTrees,k) => {
    const { state:{ models } } = this.props;
    const currentModel = {...models[this.state.index]};
    currentModel.model[dataTrees] = models[this.state.index].model[dataTrees].filter(v=>v.type !==k)

    this.props.dispatch({
      type:"sourceConfig/removeModel",
      payload:{index:this.state.index,currentModel}
    })
  }

confirmDeltePro = (id,type)=>{
  this.props.dispatch({
    type:"sourceConfig/deleteListsMeta",
    payload:{id,type}
  })
}
checkCommDetails = (id,type)=>{
  this.setState({
    communityVisible:true,
    currentCommunity:{id,type}
  })
}
handleDeleteC = ()=>{
  this.props.dispatch({
    type:"sourceConfig/deleteListsMeta",
    payload:this.state.currentCommunity,
    callback:(code)=>{
      code?this.setState({currentCommunity:{},communityVisible:false}):null;
    }
  })
}

  render() {
    const { index ,currentCommunity,communityVisible } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
      submitting,
      submitPro,
      fetchDatas,
      deleteLists,
      state:{ models ,step }
    } = this.props;

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

  const  disPlayProject= ()=> {
        let comPone = [];
        models.forEach((val, key) => {
          comPone.push(
            <Option key={key} value={key}>
              {val.modelName}
            </Option>
          );
        });
        return comPone;
    }
    const renderCurrentCommunity = ()=>{

    let rempetDom = [];
      if (this.state.currentCommunity.id) {
       let domMeta = step.community.filter(val=>val.id===this.state.currentCommunity.id)[0];
            try {
              domMeta.address = JSON.parse(domMeta.address) || [];
              domMeta.fees = JSON.parse(domMeta.fees) || [];
            } catch (e) {

            }

           var aDom = [];
           var bDom = [];
           let str = '';
           if (domMeta.address) {
             domMeta.address.forEach(val=>{
               str += val.name;
             })
             str += domMeta.detailAddr;
           }
           domMeta.fees.afixFees.forEach((value,index)=>{
             aDom.push(
               <div key={ index } style={{fontSize:17}}><label>{value.name}</label>:<span>{value.val} <span dangerouslySetInnerHTML={{__html: value.units}}></span></span></div>
             )
           })
           domMeta.fees.computedFees.forEach((value,index)=>{
             bDom.push(
               <div key={ index } style={{fontSize:17}}><label>{value.name}</label>:<span>{value.val}  <span dangerouslySetInnerHTML={{__html: value.units}}></span></span></div>
             )
           })
           rempetDom.push(
             <div key="attach">
                <div style={{fontSize:17}}><label>小区名字</label>:<span>{domMeta.communityName}</span></div>
                <div style={{fontSize:17}}><label>小区地址</label>:<span>{str}</span></div>
                <h3 style={{margin:10}}>固定费用</h3>
                {aDom}
                <h3 style={{margin:10}}>计量费用</h3>
                {bDom}
             </div>
           );

      }
      return rempetDom;
    }


    const  disPlayProjectNames = (type)=>{
      let comPone = [];
      if (type =='project'  ) {
        step[type].forEach((val, key) => {
          comPone.push(
            <Popconfirm key={key} title="你确定删除此项目吗?" onConfirm={()=>this.confirmDeltePro(val.id,type)}  okText="确定" cancelText="取消">
              <Tag className={styles.adjustScreen} color={type=='project'?"geekblue":'orange'} onClick={(e)=> false} closable onClose={(e)=>{e.stopPropagation();e.preventDefault();this.confirmDeltePro(val.id,type)}}>{type=='project'?val.ProjectName:2}</Tag>
            </Popconfirm>

          );
        });
      }else{
        step[type].forEach((val, key) => {
          comPone.push(
              <Tag key={key} className={styles.adjustScreen} color={type=='project'?"geekblue":'orange'} onClick={(e)=>this.checkCommDetails(val.id,type)} >{val.communityName}</Tag>
            );
        });
      }

      return comPone;
    }

    return (
      <PageHeaderWrapper
        title="房源配置"
        content="添加项目或添加小区"
      >
      <div className={styles.cards}>
        <Card bordered={false} className={styles.cardList}>
          {step.project.length===0?null:(
            <Skeleton loading={fetchDatas} active title >
              <h3>已有项目</h3>
              <div className={styles.projectList}>
               {disPlayProjectNames('project')}
              </div>
            </Skeleton>
          )}

            <div style={{ marginTop: 8,maxWidth:500 }}>
                <h2>添加项目</h2>
                <div className={styles.addProject}>
                  <label name="projectName">项目名称:</label>
                  <Input ref="projectname" name="projectName" placeholder="项目名称"/>
                  <Button loading={submitPro} type="primary" onClick={this.addProject}>
                    提交
                  </Button>
                </div>

            </div>
            <Modal
              visible={communityVisible}
              title={currentCommunity.communityName}
              style={{textAlign:"center"}}
              onOk={this.handleOk}
              onCancel={()=>{this.setState({currentCommunity:{},communityVisible:false})}}
              footer={[
                <Button key="back" onClick={()=>{this.setState({currentCommunity:{},communityVisible:false})}}>关闭</Button>,
                <Button key="delete" type="danger" loading={deleteLists} onClick={this.handleDeleteC}>
                  删除
                </Button>
              ]}
            >
              {renderCurrentCommunity()}
            </Modal>
        </Card>

        <Card className={styles.cardList}>
          {step.community.length===0?null:(
            <Skeleton loading={fetchDatas} active title>
              <h3>已有小区</h3>
              <div className={styles.projectList}>
               {disPlayProjectNames('community')}
              </div>
            </Skeleton>
          ) }

            <Form  hideRequiredMark style={{ marginTop: 8,maxWidth:500 }}>
              <h2>添加小区</h2>
               <FormItem {...formItemLayout} label={"小区名字"}>
                 {getFieldDecorator('communityName',{
                   rules: [
                     {
                       required: true,
                       message: '请输入',
                     },
                   ],
                 })(<Input  placeholder="小区名字"/>)}
               </FormItem>
               <FormItem {...formItemLayout} label={"小区地址"}>
                     {getFieldDecorator('address',{
                       rules: [
                         {
                           required: true,
                           message: '请输入地址信息',
                         },
                       ],
                     })(<Cascader
                        onChange={this.Cascaderselected}
                        options={geographic}
                        placeholder="请选择"
                      />)}
                </FormItem>
              <div className={styles.hideLabel}>
                <FormItem {...formItemLayout} label={"  "} >
                      {getFieldDecorator('detailsAddress',{
                        rules: [
                          {
                            required: true,
                            message: '请输入',
                          },
                        ],
                      })(<Input  placeholder="详细地址"/>)}
                 </FormItem>
              </div>

         

                <Button type="primary" loading={submitting} className={styles.center} onClick={this.handleSubmit}>
                  提交
                </Button>

            </Form>
        </Card>
      </div>
      </PageHeaderWrapper>
    );
  }
}

export default Setting;
