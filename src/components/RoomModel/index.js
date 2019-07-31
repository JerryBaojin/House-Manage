import React, { PureComponent } from 'react';
import styles from './index.less';
import { Popover ,Row , Col ,Popconfirm, Modal,Card, Table ,Input ,Button} from 'antd';
import NavLink from 'umi/navlink';
import router from 'umi/router';
export default class RoomModel extends PureComponent {

  state={
    modelVisible:false,
    type:null
  }

  handleDeleteRent(e,data){
    e.preventDefault();
    this.props.DeleteRent({orderID:data.orderInfo.orderID,room_id:data.orderInfo.room_id});
  }
  handleCheckPreOrder(e){
    e.preventDefault();
  }
  handleToReDirect(e){
    e.preventDefault();
    localStorage.setItem('e-room',JSON.stringify(this.props.data));
    router.push({
      pathname: '/sourcemanage/EditPage/room'
    })
  }
  handleSubmitRefund(data){
    //let data = this.refs.refundReason.input.value;
    this.props.checkBack({orderID:data.orderInfo.orderID,room_id:data.orderInfo.room_id});
  }
  handleShowModel = (e,type)=>{
    e.preventDefault();
    this.setState({modelVisible:true,type});
    let p =  document.getElementsByClassName('ant-popover');
    for (let index = 0; index < p.length; index++) {
      p[index].className += ' ant-popover-hidden';
      
    }
   
    // p.forEach(e => {
    //   e.className += ' ant-popover-hidden';
    // });
  }

  handleCloseModal = ()=>{
    this.setState({
      modelVisible:false
    })
  }

  render() {
    const {type} = this.state;
    const { data } = this.props;
    const getArea = ()=>{
      if(data.renttype === 0){
        return data.rooms[0]['roomArea']
      }else{
        return data.area;
      }
    }

    const renderMidDomPart = ()=>{
      switch (data.roomStatus) {
        case 0:
          return (
            <div>
              <Row className={styles.roweffct}>
                <Col span={16}>
                  <div>
                    <h5>房源状态</h5>
                    <div><span>出租状态</span>:<span>未出租</span></div>
                  </div>
                </Col>
                <Col span={8} className={styles.lright}>
                  <ul>
                    <li>
                        <i className={styles.icon10}></i>
                        <NavLink to={`/rentmanage/addpreorder?houseId=${data.uuid}`} style={{color:"#ff5600"}} target="_blank">添加预订</NavLink>
                      </li>
                      <li>
                        <i className={styles.icon7}></i>
                        <NavLink to={`/rentmanage/addrenter?houseId=${data.uuid}`} style={{color:"#ff5600"}} target="_blank">租客登记</NavLink>
                      </li>
                  </ul>
                </Col>
              </Row>
       
            </div>
          )
          break;
        case 2:
          return (
            <Row className={styles.roweffct}>
              <Col span={16}>
                <div>
                  <h5>预订信息</h5>
                  <div><span>预订状态</span>:<span style={{color:'#337ab7'}}>预订成功</span></div>
                  <div><span>预订人</span>:<span>{data.orderInfo.name}{data.orderInfo.midDogName?`(${data.orderInfo.midDogName})`:null}</span></div>
                  <div><span>预订人电话</span>:<span>{data.orderInfo.phone}</span></div>
                  <div><span>预订金额</span>:<span>{data.orderInfo.preorderMoney}</span></div>
                </div>
              </Col>
              <Col span={8} className={styles.lright} >
                <ul>
                  <li>
                    <i className={styles.icon7}></i>
                    <NavLink to={`/rentmanage/addrenter?orderId=${data.orderInfo.orderID}`} style={{color:"#ff5600"}} target="_blank">租客登记</NavLink>
                  </li>
                  <li>
                    <i className={styles.icon11}></i>
                    <NavLink to="/"  onClick={e=>this.handleShowModel(e,3)} style={{color:"#ff5600"}} target="_blank">查看预订单详情</NavLink>
                  </li>
                  <li>
                    <i className={styles.icon1}></i>
                    <Popconfirm placement="top" title={"撤销预订单"} onConfirm={e=>this.handleDeleteRent(e,data)} okText="确定" cancelText="取消">
                      <a style={{color:"#ff5600"}} onClick={e=>e.preventDefault()}>撤销预订单</a>
                    </Popconfirm>

                  </li>
                 
                </ul>
              </Col>
            </Row>
          )
          break;
        case 1:
          //已出租也可能并未填写相关信息  所以还需要判断是否有租约相关信息;
          if(data.orderInfo){
            return (
              <Row className={styles.roweffct}>
                <Col span={16}>
                  <div>
                    <h5>租约信息</h5>
                    <div><span>租约编号</span>:<span> {data.orderInfo.orderID} </span></div>
                    <div><span>租约状态</span>:<span>{data.orderInfo.name}{data.orderInfo.midDogName?`(${data.orderInfo.midDogName})`:null}</span></div>
                    <div><span>承租人电话</span>:<span>{data.orderInfo.phone}</span></div>
                    <div><span>租约起始</span>:<span>{data.orderInfo.rentTimeBegin}-{data.orderInfo.rentTimeEnd}</span></div>
                    <div><span>出租周期</span>:<span>{data.orderInfo.renttype=="0"?'月付':(data.orderInfo.renttype=="1"?'季付':(data.orderInfo.renttype=="2"?'半年付':'年付'))}</span></div>
                    <div><span>付费模式</span>:<span>{data.orderInfo.payway == '0'?'按实际费用缴纳':'随房租周期预付固定金额'}</span></div>
                    <div style={{display:data.orderInfo.roundPrePay?'block':'none'}}><span>预付金额</span>:<span>{data.orderInfo.roundPrePay}</span></div>
                  </div>
                </Col>
                <Col span={8} className={styles.lright} >
                  <ul>
                    <li>
                      <i className={styles.icon110}></i>
                      <NavLink to="/" onClick={e=>this.handleShowModel(e,1)}  target="_blank">租约详情</NavLink>
                    </li>
                    <li>
                      <i className={styles.icon15}></i>
                      <Popconfirm placement="top" title={"退房操作"} onConfirm={(e)=>this.handleSubmitRefund(data)} okText="确定" cancelText="取消">
                        <a onClick={e=>e.preventDefault()}>退房操作</a>
                      </Popconfirm>
    
                    </li>
                    <li>
                      <i className={styles.icon12}></i>
                      <NavLink  to={`/rentmanage/addrenter?orderId=${data.orderInfo.orderID}`} target="_blank">修改租约</NavLink>
                    </li>
                  
                    <li>
                      <i className={styles.icon13}></i>
                      <Popconfirm placement="top" title={"删除租约"} onConfirm={(e)=>this.handleDeleteRent(e,data)} okText="确定" cancelText="取消">
                        <a onClick={e=>e.preventDefault()}>删除租约</a>
                      </Popconfirm>
                    </li>
                  </ul>
                </Col>
              </Row>
            )
          }else{
            return [];
          }
        
        break;
         
        default:

      }
    }
    const renderImgs =(data)=>JSON.parse(data.orderInfo.idcardImgs).map((val,key)=>(<img style={{width:102}} key={key} alt={val.name} src={val.url}/>));
    const renderRoomDes =()=>data.rooms.map((val,index)=>(<div key={index}><span>{val.name}</span>:<span>{val.roomDescription}</span></div>))
    const content =(
      <div className={styles.popover} style={{padding:0}} >
          <Row className={styles.roweffcts} >
            <Col span={16}>{data.houseNumber}室{data.hallNumber}厅{data.wcNumber}卫 {data.blockName}</Col>
            <Col span={8} className={styles.lright}>编辑操作</Col>
          </Row>

          <Row className={styles.roweffct}>
            <Col span={16}>
              <div>
                <h5>房源信息</h5>
                <div><span>房源编号</span>:<span>{data.uuid}</span></div>
                <div><span>所属模板</span>:<span>{data.modelName}</span></div>
                <div><span>所属小区</span>:<span>{data.communityName}</span></div>
                <div><span>所属项目</span>:<span>{data.ProjectName}</span></div>
                <div><span>房间面积</span>:<span>{getArea()} m<sup>3</sup> </span></div>
                <div><span>对外标价</span>:<span>{data['rInfo'][0]}元/月</span></div>
                <div><span>所属类型</span>:<span>{data.housetype}</span></div>

              </div>
            </Col>
            <Col span={8} className={styles.lright}>
              <ul>
              <li>
                <i className={styles.icon0}></i>
                <NavLink to="/sourcemanage/EditPage/room" onClick={e=>this.handleToReDirect(e)}>编辑房源</NavLink>
              </li>
              </ul>
            </Col>
          </Row>

          {renderMidDomPart()}

          <Row className={styles.roweffct}>
            <Col span={16}>
              <div>
                <h5>房源备注</h5>
                {renderRoomDes()}
              </div>
            </Col>
            <Col span={8} className={styles.lright}>
             {/*
               <ul>
                <li>
                  <i className={styles.icon14}></i>
                  <NavLink to="/sourcemanage/AddHouse/info" target="_blank">编辑备注</NavLink>
                </li>
              </ul>
            */}
            </Col>
          </Row>
        {/*  <Row className={styles.roweffct}>
            <Col span={16}>
              <div>
                <div><span>房源录入者</span>:<span>NO.100506725A</span></div>
              </div>
            </Col>
            <Col span={8} className={styles.lright}>
              <ul>
                <li>
                  <i className={styles.icon14}></i>
                  <NavLink to="/sourcemanage/AddHouse/info" target="_blank">编辑备注</NavLink>
                </li>
              </ul>
            </Col>
          </Row>*/}

      </div>
    )
    return (
      <div className={styles.container}>
        <Popover  className={styles.M} placement="right" content={content} trigger="click">
        <div className={styles.MainBox}>
          <div  className={data.roomStatus!==0?(data.roomStatus==2?styles.status0:styles.status1):styles.status0}>
            <p>{data.houseNumber}室{data.hallNumber}厅{data.wcNumber}卫</p>
            <p>{data.blockName}</p>

            <div className={data.roomStatus!==0?(data.roomStatus==2?styles.preOrder:styles.renting):styles.empty}>
              <i>{data.roomStatus!==0?(data.roomStatus==2?'定':''):'空'}</i>
              {/*<p>43天</p>*/}
            </div>
          </div>
          <div className={styles.bottom}>
            <p>￥{data.rInfo[0]}</p>
            <p style={{color:"#4f7ae8"}}>{data.rInfo[1]}</p>
          </div>
        </div>
        </Popover>
        <Modal
            width={type==1?"44%":350}
            visible={this.state.modelVisible}
            onOk={this.handleCloseModal}
            onCancel={this.handleCloseModal}
        >
        { type ==1?(
             <Card  size="small" title="基本信息"  style={{ marginTop: -15,width:"102%" }}>         
             <Row className={styles.base} >
               <Col span={13}> <div className={styles.leftTitle}>租约编号:</div>  <div className={styles.rigthtInfo}> {data.orderInfo.orderID} </div> </Col>
               <Col span={11}> <div className={styles.leftTitle}>租约状态:</div>  <div className={styles.rigthtInfo}> {data.orderInfo.orderID} </div> </Col>
             </Row>
             <Row className={styles.base}>
               <Col span={13}> <div className={styles.leftTitle}>房源信息:</div>  <div className={styles.rigthtInfo}> {data.blockName} </div> </Col>
               <Col span={11}> <div className={styles.leftTitle}>承租人姓名:</div>  <div className={styles.rigthtInfo}> {data.orderInfo.name} </div> </Col>
             </Row>
             <Row className={styles.base}>
               <Col span={13}> <div className={styles.leftTitle}>承租人手机:</div>  <div className={styles.rigthtInfo}> {data.orderInfo.phone} </div> </Col>
               <Col span={11}> <div className={styles.leftTitle}>证件类型:</div>  <div className={styles.rigthtInfo}>身份证 </div> </Col>
             </Row>
             <Row className={styles.base}>
               <Col span={13}> <div className={styles.leftTitle}>证件照片:</div>  <div className={styles.rigthtInfo}> {renderImgs(data)} </div> </Col>
               <Col span={11}> <div className={styles.leftTitle}>证件号码:</div>  <div className={styles.rigthtInfo}> {data.orderInfo.idcard} </div> </Col>
             </Row>
             </Card>
        ):null}
        { type ===2?(
              <div>
                  <label>退房原因</label>
                  <Input ref='refundReason' style={{margin:"20px 0"}}/>
                  <Button type="primary" onClick={()=>this.handleSubmitRefund()}>提交 </Button>
              </div>
        ):null}
       { type === 3?(
              <div>
                  <div> <span>预订状态</span> <span>待签约</span> </div>
                  <div> <span>预订人</span> <span>{data.orderInfo.name}({data.orderInfo.midDogName})</span> </div>
                  <div> <span>预定人电话</span> <span>{data.orderInfo.phone}</span> </div>
                  <div> <span>预定金额</span> <span>{data.orderInfo.preorderMoney}</span> </div>
              </div>
        ):null}
         
        </Modal>
        
      </div>
    );
  }
}
