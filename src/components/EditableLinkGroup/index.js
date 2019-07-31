import React, { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import { Button,Popover,Icon } from 'antd';
import styles from './index.less';

// TODO: 添加逻辑

class EditableLinkGroup extends PureComponent {
  static propTypes = {
    links: PropTypes.array,
    onAdd: PropTypes.func,
    linkElement: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  };

  static defaultProps = {
    links: [],
    onAdd: () => {},
    linkElement: 'a',
  };



  render() {
    const { links, linkElement, onAdd, showInfo,handleRemove } = this.props;
    const  renderLinks = ()=>{
      const tempDom = [];
      links.map((val,index)=>{
        tempDom.push(

          <span  key={index} onClick={()=>showInfo(val,index)}>
              <Popover  content={  <Button type="primary" onClick={(e)=>handleRemove(e,index,val.id)} shape="circle" size="small"  icon="close" />}>
                {val.modelName}
              </Popover>
          </span>

        )
      })
      return tempDom;
    }
    return (
      <div className={styles.linkGroup}>
        {renderLinks()}
          <Button size="small" type="primary" ghost onClick={onAdd} icon="plus">
            添加
          </Button>
      </div>
    );
  }
}

export default EditableLinkGroup;
