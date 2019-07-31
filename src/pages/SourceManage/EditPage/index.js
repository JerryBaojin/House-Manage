import React, { PureComponent, Fragment } from 'react';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../style.less';


export default class Basic extends PureComponent {
  state ={
    title:'',
    content:" "
  }

  static getDerivedStateFromProps (nextProps) {
      switch (nextProps.location.pathname) {
        case "/sourcemanage/EditPage/room":
            return {
              title:"编辑房源"
            }
          break;
        case "/sourcemanage/EditPage/rent":
            return {
              title:"租约信息"
            }
          break;

        default:
          break;
      }
  }

  render() {
    const { location, children } = this.props;
    const { title, content } = this.state;
    
    return (
      <PageHeaderWrapper
        title
        content
      >
        <Card bordered={false}>
        {children}
        </Card>
      </PageHeaderWrapper>
    );
  }
}
