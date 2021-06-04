import React from 'react';
import Form, { Field } from 'qi-form';
import Input from '../components/input';

const ShouldUpdateForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
  }

  return (
    <Form form={form} onFinish={onFinish}>
      {/* UI不更新 */}
      <Field name="username" shouldUpdate={() => false}>
        <Input placeholder="请输入用户名" />
      </Field>
      <Field name="password">
        <Input placeholder="请输入密码" type="password" />
      </Field>
      <button type="submit">提交</button>
    </Form>
  );
};

export default ShouldUpdateForm;
