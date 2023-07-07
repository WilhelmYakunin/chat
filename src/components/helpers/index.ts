export const getImageUrl = (name: string | URL) => {
  return new URL(name, import.meta.url).href;
};
