import React from 'react';
import { FormEvent } from 'react';
import FieldContext from './field-context';
import useForm from './use-form';

const Form = (props: any) => {
  const { form, children, ...restProps } = props;
  const [formInstance] = useForm(form);
  return (
    <form
      {...restProps}
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        formInstance.submit();
      }}
    >
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  );
};
export default Form;
