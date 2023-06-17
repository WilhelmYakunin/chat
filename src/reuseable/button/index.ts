const submitBtn = ({
  value,
  type,
}: {
  value: string;
  type: string;
}): HTMLElement => {
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  return input;
};

export default submitBtn;
