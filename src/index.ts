import FieldForm from './form';
import Field from './field';
import useForm from './use-form';

const Form = FieldForm as any;
Form.Field = Field;
Form.useForm = useForm;

export { Field, useForm };

export default Form;
