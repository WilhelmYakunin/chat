// import './style';

const form = ({ chidlren }: { chidlren?: HTMLElement[] }): HTMLElement => {
  const form = document.createElement('form');
  form.setAttribute('action', '');
  form.setAttribute('method', 'POST');
  if (chidlren) chidlren.forEach((element) => form.appendChild(element));

  return form;
};

export default form;
