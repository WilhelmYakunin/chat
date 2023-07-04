import { words } from '../../langs';

export interface Ischema {
  [x: string]: { pattern: RegExp; description: string };
}

const validateFormValues = (
  schema: Ischema,
  data: { [x: string]: FormDataEntryValue }
) => {
  return Object.keys(data).reduce((acc, key) => {
    if (!Object.keys(schema).includes(key))
      throw Error(words.VALIDATION.UNKNOWN_FIELD + key);
    const value = data[key];
    if (typeof value === 'string' && !value.match(schema[key].pattern)) {
      acc[key] = {
        check: words.VALIDATION.ON_ERROR,
        description: schema[key].description,
      };
    } else {
      acc[key] = words.VALIDATION.VALID;
    }
    return acc;
  }, {} as Icheck);
};

export interface Icheck {
  [x: string]: { check: string; description: string } | string;
}

export default validateFormValues;
