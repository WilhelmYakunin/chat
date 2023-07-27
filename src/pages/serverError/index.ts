import Block from '../../components/block';
import './style.scss';

import { template } from './template';
const serverErrorPage = (): Block => new Block('div', { template });

export default serverErrorPage;
