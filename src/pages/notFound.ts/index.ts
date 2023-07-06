import Block from '../../components/block';
import render from '../../components/render';
import { template } from './template';

import './style.scss';

const notFoundPage = () => {
  const block = new Block('div', { template });

  return render(block.getContent());
};

export default notFoundPage;
