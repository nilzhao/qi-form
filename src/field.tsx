import AsyncValidator, { RuleItem } from 'async-validator';
import React from 'react';
import { Component } from 'react';
import FieldContext from './field-context';

interface TProps {
  name: string;
  children: any;
  shouldUpdate?: (prev: any, cur: any) => boolean;
  rules?: Array<RuleItem | ((context: React.Component) => RuleItem)>;
}

class Field extends Component<TProps> {
  static contextType = FieldContext;

  private cancelRegister: any;
  private validatePromise: Promise<string[]> | null = null;
  private errors: string[] = [];

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
  onStoreChanged = (prevStore: any, curStore: any) => {
    const { shouldUpdate } = this.props;
    if (typeof shouldUpdate === 'function') {
      if (shouldUpdate(prevStore, curStore)) {
        this.forceUpdate();
      }
    } else {
      this.forceUpdate();
    }
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

  validateRules = () => {
    const { getFieldValue } = this.context;
    const { name } = this.props;
    const currentValue = getFieldValue(name);
    const rootPromise = Promise.resolve().then(() => {
      const filteredRules = this.getRules();
      const promise = this.executeValidate(name, currentValue, filteredRules);
      promise
        .catch((e) => e)
        .then((errors: string[] = []) => {
          if (this.validatePromise === rootPromise) {
            this.validatePromise = null;
            this.errors = errors;
            this.forceUpdate();
          }
        });
      return promise;
    });
    this.validatePromise = rootPromise;
    return rootPromise;
  };

  getRules = () => {
    const { rules = [] } = this.props;
    return rules.map((rule) => {
      if (typeof rule === 'function') {
        return rule(this.context);
      }
      return rule;
    });
  };

  executeValidate = (
    namePath: string,
    value: any,
    rules: any,
  ): Promise<string[]> =>
    new Promise(async (resolve, reject) => {
      for (let i = 0; i < rules.length; i++) {
        const errors = await this.validateRule(namePath, value, rules[i]);
        if (errors.length) {
          reject(errors);
          return;
        }
      }
      resolve([]);
    });

  validateRule = async (name: string, value: any, rule: any) => {
    const clonedRule = { ...rule };
    const validator = new AsyncValidator({
      [name]: [clonedRule],
    });
    try {
      await validator.validate({ [name]: value });
    } catch (err) {
      if (err.errors) {
        return err.errors.map((error: any) => error.message);
      }
    }
    return [];
  };

  render() {
    const { children } = this.props;
    return React.cloneElement(children, this.controlled());
  }
}

export default Field;
