import { words } from '../../langs';

export interface Ischema {
  [x: string]: { pattern: RegExp; description: string };
}

export const validateInput = ({
  target,
  rule,
}: {
  target: HTMLElement;
  rule: RegExp;
}): void | string => {
  const pattern = target.nextElementSibling;

  const hasInvalidClass = pattern?.className?.slice(-7) === '--shown';
  if (pattern) {
    !(target as HTMLTextAreaElement).value.match(rule) && !hasInvalidClass
      ? (pattern.className += '--shown')
      : pattern.className;

    !!(target as HTMLTextAreaElement).value.match(rule) && hasInvalidClass
      ? (pattern.className = pattern.className?.slice(0, -7))
      : pattern.className;
  }
};

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
      acc[key] = {
        check: words.VALIDATION.VALID,
      };
    }
    return acc;
  }, {} as Icheck);
};

export interface Icheck {
  [x: string]: { check: string; description?: string };
}

export default validateFormValues;
