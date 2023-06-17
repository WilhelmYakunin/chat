const textLink = ({
  href,
  text,
}: {
  href: string;
  text: string;
}): HTMLElement => {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;

  return link;
};

export default textLink;
