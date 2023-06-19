// import './style';

const textInput = ({
  name,
  type,
  placeHolder,
  id,
}: {
  name: string;
  type: string;
  placeHolder?: string;
  id?: string;
}): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;

  if (placeHolder) {
    input.placeholder = placeHolder;
  }

  if (id) {
    input.id = id;
  }

  return input;
};

export default textInput;
