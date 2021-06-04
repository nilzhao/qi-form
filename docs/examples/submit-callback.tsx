import React, { useEffect } from 'react';
import Form, { Field } from 'qi-form';
import Input from '../components/input';

const BasicForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
  }

  return (
    <Form form={form} onFinish={onFinish}>
      <Field name="username">
        <Input placeholder="请输入用户名" />
      </Field>
      <Field name="password">
        <Input placeholder="请输入密码" />
      </Field>
      <button type="submit">提交</button>
    </Form>
  );
};

export default BasicForm;
