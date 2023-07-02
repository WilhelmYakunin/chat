// import './style';

const form = ({ chidlren }: { chidlren?: HTMLElement[] }): HTMLFormElement => {
  const form = document.createElement('form');
  if (chidlren) chidlren.forEach((element) => form.appendChild(element));

  return form;
};

export default form;
