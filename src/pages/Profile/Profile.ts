import template from './Profile.hbs?raw';
import './Profile.scss';

function createDOMFromHTML(htmlString: string): DocumentFragment {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const fragment = document.createDocumentFragment();

    while (doc.body.firstChild) {
        fragment.appendChild(doc.body.firstChild);
    }

    return fragment;
};

export function renderProfilePage() {
    const app = document.getElementById('app');
    if (!app) return;

    const domFragment = createDOMFromHTML(template);

    app.textContent = '';
    app.appendChild(domFragment);
};

