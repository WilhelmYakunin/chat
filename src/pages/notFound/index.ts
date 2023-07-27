import Block from '../../components/block';
import { template } from './template';

import './style.scss';

const notFoundPage = (): Block => new Block('div', { template });

export default notFoundPage;
