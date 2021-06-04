import React from 'react';
import Form, { Field } from 'qi-form';
import Input from '../components/input';

const BasicForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('onFinish', values);
  };

  const onFinishFailed = (errors: any) => {
    console.log('onFinishFailed', errors);
  };

  return (
    <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Field
        name="username"
        rules={[
          { required: true, message: '请输入用户名' },
          { pattern: /^\w{6}/, message: '长度应为6' },
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Field>
      <Field
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { pattern: /^\d{3}/, message: '长度应为3' },
        ]}
      >
        <Input placeholder="请输入密码" />
      </Field>
      <button type="submit">提交</button>
    </Form>
  );
};

export default BasicForm;
