import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  Form,
  Card,
  Radio,
  Statistic, 
  Row,
  Col,
  DatePicker,
  Button,
  Table,
  Tabs,
  Tag,
  Popconfirm,
  Pagination
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import {page_size} from '@/defaultSettings'

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const operations = <Button>额外操作</Button>;

@connect(({ account, loading }) => ({
  loading: loading.effects['form/submitRegularForm'],
  data: account,
}))


// @Form.create()

class BasicForms extends React.PureComponent {

  constructor(props) {

    super(props);

    this.state = {
      date: 0,
      accountType: 'all'
    };

    this.onChangeTime = this.onChangeTime.bind(this);
    this.pageChangeHandler = this.pageChangeHandler.bind(this);
    this.pageChangeOHandler = this.pageChangeOHandler.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  componentDidMount() {

    const { dispatch } = this.props;

    dispatch({
      type: 'account/all',
      payload: {type: 'all'}
    });

    dispatch({
      type: 'account/all',
      payload: {type: 'month'}
    });
  }

  deleteHandler(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/remove',
      payload: id,
    });
  }

  pageChangeHandler(page) {
      const { dispatch } = this.props;
      dispatch(
        routerRedux.push({
          pathname: '/form/basic-form',
          query: { page },
        })
      );
    
  }

  pageChangeOHandler(page) {

    const { dispatch } = this.props;
    let { accountType } = this.state;
    dispatch({
      type: 'account/fetch',
      payload: { type: accountType, page },
    });
  }

  editHandler(id, values) {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/patch',
      payload: { id, values },
    });
  }

  onChangeTime(d, dateString) {

    let date;
    !(d.length) ? date = 0 : date = 1;
    if (date == 1) {
      // 根据时间段查询 支出 收入
      const { dispatch } = this.props;
      dispatch({
        type: 'account/date',
        payload: { begin: dateString[0], end: dateString[1] },
      });
    }
    this.setState({ date });
  }

  handleTabClick(type){
    this.setState({ accountType: type });
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetch',
      payload: { type },
    });
  }

  add0(m){return m<10?'0'+m:m }

  render() {
    let { dispatch, list: dataSource, total, page, all, month, date1, zc, sr } = this.props.data;
    let { loading } = this.props;

    // const {
    //   form: { getFieldDecorator, getFieldValue },
    // } = this.props;

    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 7 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 12 },
    //     md: { span: 10 },
    //   },
    // };

    // const submitFormLayout = {
    //   wrapperCol: {
    //     xs: { span: 24, offset: 0 },
    //     sm: { span: 10, offset: 7 },
    //   },
    // };

    const columns = [
      {
        title: '类型',
        dataIndex: 'owntype',
        key: 'owntype',
        render: (text) => {

          if (text == 'zc') {
            return <a href="javascript:;">支出</a>
          }
          return <a href="javascript:;">收入</a>
        }
      },
      {
        title: '经手人',
        key: 'handle',
        dataIndex: 'handle',
        render: handle => (
          <span>
            <Tag>
              {handle}
            </Tag>
          </span>
        ),
      },
      {
        title: '转账类型',
        dataIndex: 'way',
        key: 'way',
      },
      {
        title: '转账方式',
        dataIndex: 'skfs',
        key: 'skfs',
      },
      {
        title: '金额',
        dataIndex: 'money',
        key: 'money',
        render: text => (
          <Statistic title="" value={text} precision={2} />
        )
      },
      {
        title: '时间',
        dataIndex: 'date',
        key: 'date',
        render: shijianchuo => {
          let time = new Date(shijianchuo * 1000);
          let y = time.getFullYear();
          let m = time.getMonth()+1;
          let d = time.getDate();
          let h = time.getHours();
          let mm = time.getMinutes();
          let s = time.getSeconds();
          return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span className={styles.operation}>
            
            <Popconfirm
              title="是否删除?"
              onConfirm={this.deleteHandler.bind(this, record.id)}
            >
              <a href="">Delete</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <PageHeaderWrapper
          title={<FormattedMessage id="app.forms.basic.title" />}
          content={<FormattedMessage id="app.forms.basic.description" />}
        >
        
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic title="累计支出" value={all.zc} precision={2} />
            </Col>
            <Col span={6}>
              <Statistic title="累计收入" value={all.sr} precision={2} />
            </Col>
            <Col span={6}>
              <Statistic title="累计营收状况" value={ Math.round((all.sr - all.zc)*Math.pow(10, 2))/Math.pow(10, 2) } precision={2} />
            </Col>
          </Row>,
          <Row gutter={16}>
            <Col span={6}>
              <Statistic title="本月支出" value={month.zc} precision={2} />
            </Col>
            <Col span={6}>
              <Statistic title="本月收入" value={month.sr} precision={2} />
            </Col>
            <Col span={6}>
              <Statistic title="本月营收状况" value={ Math.round((month.sr - month.zc)*Math.pow(10, 2))/Math.pow(10, 2) } precision={2} />
            </Col>
          </Row>,
          <div>
            <RangePicker
              onChange={this.onChangeTime.bind(this)}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </div>,
          { (this.state.date == 1) ? (<Row gutter={16}>
            <Col span={6}>
              <Statistic title="当前时间段支出" value={date1.zc} />
            </Col>
            <Col span={6}>
              <Statistic title="当前时间段收入" value={date1.sr} precision={2} />
            </Col>
            <Col span={6}>
              <Statistic title="当前时间段营收状况" value={Math.round((date1.sr - date1.zc)*Math.pow(10, 2))/Math.pow(10, 2)} precision={2} />
            </Col>
          </Row>) : null }
          <Tabs 
            tabBarExtraContent={operations}
            onTabClick={this.handleTabClick}
          >
          <TabPane tab="全部" key="all">
          <div className={styles.normal}>
            <div>
              <Table 
                columns={columns} 
                dataSource={dataSource}
                loading={loading}
                rowKey={record => record.id}
                pagination={false}
              />
              <Pagination
                className="ant-table-pagination"
                total={total}
                current={page}
                pageSize={page_size}
                onChange={this.pageChangeHandler}
              />
            </div>
          </div>
          </TabPane>
          <TabPane tab="支出" key="zc">
            <div className={styles.normal}>
            <div>
              <Table 
                columns={columns} 
                dataSource={zc.list}
                loading={loading}
                rowKey={record => record.id}
                pagination={false}
              />
              <Pagination
                className="ant-table-pagination"
                total={zc.total}
                current={zc.page}
                pageSize={page_size}
                onChange={this.pageChangeOHandler}
              />
            </div>
          </div>
          </TabPane>
          <TabPane tab="收入" key="sr">
            <div className={styles.normal}>
            <div>
              <Table 
                columns={columns} 
                dataSource={sr.list}
                loading={loading}
                rowKey={record => record.id}
                pagination={false}
              />
              <Pagination
                className="ant-table-pagination"
                total={sr.total}
                current={sr.page}
                pageSize={page_size}
                onChange={this.pageChangeOHandler}
              />
            </div>
          </div>
          </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BasicForms;
