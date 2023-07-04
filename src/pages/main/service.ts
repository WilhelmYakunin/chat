import { Ischema } from '../../components/helpers/validate';
import { messageFileds } from './model';
import { messagePattern } from '../../components/helpers/validationRules';
import { words } from '../../langs';

export const messageFormSchema: Ischema = {
  [messageFileds.message]: {
    pattern: messagePattern,
    description: words.VALIDATION.PATTERTNS.MESSAGE,
  },
};
