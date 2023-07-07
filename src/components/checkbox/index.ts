const checkbox = ({
  name,
  id,
  checked,
}: {
  name: string;
  id?: string;
  checked?: boolean;
}) => {
  const input = document.createElement('input');
  input.name = name;
  input.type = 'checkbox';

  if (id) {
    input.id = id;
  }

  if (checked) {
    input.checked = true;
  }

  return input;
};

export default checkbox;
