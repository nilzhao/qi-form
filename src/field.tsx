import React from 'react';
import { Component } from 'react';
import FieldContext from './field-context';

class Field extends Component<{ name: string; children: any }> {
  static contextType = FieldContext;

  private cancelRegister: any;

  // 注册自己到 fieldEntities 中
  componentDidMount() {
    const { registerField } = this.context;
    this.cancelRegister = registerField(this);
  }

  // 把自己从 fieldEntities 中清除
  componentWillUnmount() {
    this.cancelRegister?.();
  }

  // 每个field都包含此方法,供 form 调用, 更新自己
  onStoreChanged = () => {
    this.forceUpdate();
  };

  // Field 中传进来的子元素变为受控组件，也就是主动添加上 value 和 onChange 属性方法
  controlled = () => {
    const { name } = this.props;
    const { getFieldValue, setFieldsValue } = this.context;

    return {
      value: getFieldValue(name),
      onChange: (e: any) => {
        const newValue = e.target.value;
        setFieldsValue({
          [name]: newValue,
        });
      },
    };
  };

  render() {
    const { children } = this.props;
    return React.cloneElement(children, this.controlled());
  }
}

export default Field;
