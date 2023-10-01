export const getImageUrl = (name: string | URL): string => {
  return new URL(name, import.meta.url).href;
};
