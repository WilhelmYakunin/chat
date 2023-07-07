import render from '../../components/render';
import Block from '../../components/block';
import './style.scss';

import { template } from './template';

const serverErrorPage = () => {
  const block = new Block('div', { template });

  return render(block.getContent());
};

export default serverErrorPage;
