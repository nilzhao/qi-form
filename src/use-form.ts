import { useRef } from 'react';
import { allPromiseFinish } from './utils/asyncUtil';
import { setValues } from './utils/valueUtil';

interface TObj {
  [key: string]: any;
}
export type ReducerAction = (action: {
  type: SVGFESpecularLightingElement;
  payload: any;
}) => {};

class FormStore {
  // 存储表单数据
  private store: any = {};
  // 所有的字段
  private fieldEntities: any[] = [];
  // 初始值
  private initialValues: any = {};

  // 所有的回调函数
  private callbacks: TObj = {};

  private errors: any = [];

  setInitialValues = (initialValues: any, init: boolean) => {
    this.initialValues = initialValues;
    if (init) {
      this.store = setValues({}, initialValues, this.store);
    }
  };

  setCallbacks = (callbacks: TObj) => {
    this.callbacks = callbacks;
  };

  // 表单项注册到 fieldEntities
  registerField = (entity: any) => {
    this.fieldEntities.push(entity);
    // 返回取消注册函数
    return () => {
      this.fieldEntities = this.fieldEntities.filter((item) => item !== entity);
      delete this.store[entity.props.name];
    };
  };

  getFieldValue = (name: string) => this.store[name];
  getFieldsValue = () => this.store;

  notifyObservers = (prevStore: any) => {
    // 通过 fieldEntities 获取到所有表单项，然后遍历去调用表单项的 onStoreChange 方法更新表单项
    this.fieldEntities.forEach((entity: any) => {
      const { name } = entity.props;
      Object.keys(this.store).forEach((key) => {
        if (key === name) {
          entity.onStoreChanged(prevStore, this.getFieldsValue());
        }
      });
    });
  };

  setFieldsValue = (curStore: TObj) => {
    const prevStore = this.store;
    if (curStore) {
      this.store = setValues(this.store, curStore);
    }
    this.notifyObservers(prevStore);
  };

  validateFields = () => {
    const promiseList: any[] = [];

    this.fieldEntities.forEach((entity: any) => {
      const { name, rules } = entity.props;
      if (!rules || rules.length === 0) {
        return;
      }
      const promise = entity.validateRules();
      promiseList.push(
        promise
          .then(() => ({ name, errors: [] }))
          .catch((errors: any) =>
            Promise.reject({
              name,
              errors,
            }),
          ),
      );
    });
    const summaryPromise = allPromiseFinish(promiseList);
    const returnPromise = summaryPromise
      .then(() => this.getFieldsValue())
      .catch((results) => {
        const errorList = results.filter(
          (result: any) => result && result.errors.length,
        );
        return Promise.reject({
          values: this.getFieldsValue(),
          errorFields: errorList,
        });
      });
    returnPromise.catch((e) => e);
    return returnPromise;
  };

  submit = () => {
    this.validateFields()
      .then((values: any) => {
        const { onFinish } = this.callbacks;
        try {
          onFinish?.(values);
        } catch (error) {
          console.error(error);
        }
      })
      .catch((err) => {
        const { onFinishFailed } = this.callbacks;
        onFinishFailed?.(err);
      });
  };

  getForm = () => ({
    getFieldValue: this.getFieldValue,
    getFieldsValue: this.getFieldsValue,
    setFieldsValue: this.setFieldsValue,
    registerField: this.registerField,
    submit: this.submit,
    getInternalHooks: () => {
      return {
        setInitialValues: this.setInitialValues,
        setCallbacks: this.setCallbacks,
      };
    },
  });
}

export default function useForm(form: any) {
  const formRef = useRef<any>();
  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const formStore = new FormStore();
      formRef.current = formStore.getForm() as any;
    }
  }
  return [formRef.current];
}
