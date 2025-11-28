import Handlebars from 'handlebars';
import templateSource from './Error.hbs?raw';
import type { ErrorData } from '../../type/error.type.ts';

const templateSpecString = Handlebars.precompile(templateSource);

const templateFunction = new Function(`return ${templateSpecString};`)();

const template = Handlebars.template(templateFunction);

function getErrorData(path: string): ErrorData {
    if (path === '/500') {
        return {
            code: '500',
            title: 'Мы уже фиксим'
        };
    }
    return {
        code: '404',
        title: 'Не туда попали'
    };
};

function createDOMFromHTML(htmlString: string): DocumentFragment {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const fragment = document.createDocumentFragment();

    while (doc.body.firstChild) {
        fragment.appendChild(doc.body.firstChild);
    }

    return fragment;
};

export function renderErrorPage(path: string) {
    const app = document.getElementById('app');
    if (!app) return;

    const data = getErrorData(path);
    const html = template(data);
    const domFragment = createDOMFromHTML(html);
    app.textContent = '';
    app.appendChild(domFragment);
};

