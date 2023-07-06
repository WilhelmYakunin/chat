import { words } from '../../langs/index';

const bemElem = (bem: string) => 'servererror' + '__' + bem;

export const template = `<div class=${bemElem('container')}>
        <span>${words.SERVER_ERROR_NUMBER}</span>
        <span>${words.SERVER_ERROR}</span>
        <a class=${bemElem('backNavigate')} 
            href=${document.referrer}>${words.TO_HOME}</a>
    </div>`;
