import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ sourceConfig }) => ({
  data: sourceConfig.step,
}))
class ResultAddHouse extends React.PureComponent {
  render() {
    const { data } = this.props;
    const onFinish = () => {
      this.props.dispatch({
        type:"sourceConfig/resetForm"
      })
      router.push('/sourcemanage/AddHouse/info');
    };

    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          继续添加
        </Button>
        
        <Link to="/sourcemanage/Center"><Button>查看房源</Button></Link>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="添加成功"
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default ResultAddHouse;
