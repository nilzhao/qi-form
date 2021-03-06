import React, { useEffect } from 'react';
import Form, { Field } from 'qi-form';
import Input from '../components/input';

const BasicForm = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      username: '奇奇',
    });
  }, []);

  return (
    <Form form={form}>
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
