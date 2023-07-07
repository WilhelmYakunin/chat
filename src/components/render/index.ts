const render = (page: HTMLElement) => {
  const parent = document.getElementById('app');
  const replacer = document.createElement('div');
  replacer.setAttribute('id', 'replacee');
  replacer.appendChild(page);
  return parent?.replaceChild(replacer, parent.children[0]);
};

export default render;
