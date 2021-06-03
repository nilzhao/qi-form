const Input = (props: any) => {
  const { value = '', onChange, ...restProps } = props;
  return <input {...restProps} value={value} onChange={onChange} />;
};

export default Input;
