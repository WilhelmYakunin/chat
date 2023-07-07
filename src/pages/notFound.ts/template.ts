import { words } from '../../langs/index';

const bemElem = (bem: string) => 'notfound' + '__' + bem;

export const template = `<div class=${bemElem('container')}>
        <span>${words.NOT_FOUND_NUMBER}</span>
        <span>${words.NOT_FOUND}</span>
        <a class=${bemElem('back-navigate')} 
            href=${document.referrer}>${words.TO_HOME}</a>
    </div>`;
