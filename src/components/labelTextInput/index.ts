// import './style';

const label = ({ forAttr }: { forAttr: string }): HTMLElement => {
  const label = document.createElement('label');
  label.setAttribute('for', forAttr);

  return label;
};

export default label;
