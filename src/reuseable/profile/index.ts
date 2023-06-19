const profileIcon = ({ iconLink }: { iconLink?: string }): HTMLElement => {
  const container = document.createElement('div');
  const img = document.createElement('img');
  img.alt = 'user depiction';

  if (iconLink) {
    img.src = iconLink;
  }

  container.appendChild(img);
  return container;
};

export default profileIcon;
