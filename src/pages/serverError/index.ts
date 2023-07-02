import render from '../../components/render';
import textLink from '../../components/textLink';
import './style.scss';

import { words } from '../../langs/index';

const bemElem = (bem: string) => 'server-error' + '__' + bem;

const notFoundPage = () => {
  const spanNum = document.createElement('span');
  spanNum.textContent = words.SERVER_ERROR_NUMBER;

  const info = document.createElement('span');
  info.textContent = words.SERVER_ERROR;

  const back = textLink({ href: document.referrer, text: words.TO_HOME });
  back.className = bemElem('back-navigate');

  const container = document.createElement('div');
  container.appendChild(spanNum);
  container.appendChild(info);
  container.appendChild(back);
  container.className = bemElem('container');

  return render(container);
};

export default notFoundPage;
