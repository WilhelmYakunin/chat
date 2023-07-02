export const validate = (data: { [x: string]: FormDataEntryValue }) => {
  Object.keys(data).reduce((acc, key) => {
    const value = data[key];
    if (typeof value === 'string') {
      value.match(/^$|\s+/);
    }
    return acc;
  }, {});
};
