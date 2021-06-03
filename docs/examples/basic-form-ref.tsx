import React, { Component } from 'react';
import Form, { Field } from 'qi-form';
import Input from '../components/input';

class BasicFormRef extends Component {
  formRef = React.createRef() as any;

  componentDidMount() {
    this.formRef.current.setFieldsValue({
      username: '奇奇',
    });
  }

  render() {
    return (
      <Form ref={this.formRef}>
        <Field name="username">
          <Input placeholder="请输入用户名" />
        </Field>
        <Field name="password">
          <Input placeholder="请输入密码" />
        </Field>
        <button type="submit">提交</button>
      </Form>
    );
  }
}

export default BasicFormRef;
