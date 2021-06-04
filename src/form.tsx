import React, { useRef } from 'react';
import { FormEvent } from 'react';
import FieldContext from './field-context';
import useForm from './use-form';

const Form = React.forwardRef((props: any, ref) => {
  const { form, children, initialValues, ...restProps } = props;
  const [formInstance] = useForm(form);
  const { setInitialValues } = formInstance.getInternalHooks();
  React.useImperativeHandle(ref, () => formInstance);
  const mountRef = useRef<boolean>(false);
  setInitialValues(initialValues, !mountRef.current);

  if (!mountRef.current) {
    mountRef.current = true;
  }

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
});
export default Form;
