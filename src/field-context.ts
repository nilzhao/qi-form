import React from 'react';

const warningFn: any = () => {
  console.log('warning');
};

const FieldContext = React.createContext({
  getFieldValue: warningFn,
  getFieldsValue: warningFn,
  setFieldsValue: warningFn,
  registerField: warningFn,
  submit: warningFn,
});

export default FieldContext;
