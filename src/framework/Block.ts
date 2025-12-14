import EventBus from './EventBus.ts'
import { v4 as makeUUID } from 'uuid';
import Handlebars from 'handlebars';

type Props = Record<string, unknown>;
type Meta = { tagName: string; props: Props };

export default class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_RENDER: "flow:render",
    FLOW_CDU: "flow:component-did-update"
  };

  private _element: HTMLElement | null = null;
  private _meta: Meta | null = null;
  private eventBus: () => EventBus;
  public props: Props;
  private _id: string = makeUUID();
  public children: { [id: string]: Block } = {};

  constructor(tagName: string = "div", propsAndChildren: object = {}) {
    const eventBus = new EventBus();
    const { children, props } = this._getChildren(propsAndChildren);

    this._meta = { tagName, props };
    this._id = makeUUID();

    this.children = children;
    this.props = this._makePropsProxy({ ...props, __id: this._id });
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _getChildren(propsAndChildren: object) {
    const children: { [id: string]: Block } = {};
    const props: Props = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
  }

  private _createResources(): void {
    const { tagName } = this._meta!;
    this._element = this._createDocumentElement(tagName);
  }

  public init(): void {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount();

    Object.values(this.children).forEach(child => {
      child.dispatchComponentDidMount();
    });
  }

  public componentDidMount(): void {}

  public dispatchComponentDidMount(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: unknown, newProps: unknown): void {
    const shouldUpdate = this.componentDidUpdate(oldProps as Props, newProps as Props);
    if (shouldUpdate === true) {
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  public componentDidUpdate(oldProps: Props, newProps: Props): boolean {
    return oldProps === newProps || true;
  }

  public setProps(nextProps: Props | null): void {
    if (!nextProps || typeof nextProps !== 'object') return;

    Object.assign(this.props, nextProps);
  }

  public get element(): HTMLElement | null {
    return this._element;
  }

  private _addEvents() {
    const { events = {} } = this.props as { events?: Record<string, EventListener> };

    Object.keys(events).forEach(eventName => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  private _removeEvents() {
    const { events = {} } = this.props as { events?: Record<string, EventListener> };

    Object.keys(events).forEach(eventName => {
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }

  private _render(): void {
    const block = this.render();

    const fragment = block instanceof DocumentFragment ? block : this.compile(block, this.props);

    const newElement = fragment.firstElementChild as HTMLElement;

    if (this._element) {
      this._removeEvents();
      this._element.replaceWith(newElement);
    }

    this._element = newElement;
    this._addEvents();
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  public render(): string | DocumentFragment {
    return '';
  }

  public compile(template: string, props: Props): DocumentFragment {
    const propsAndStubs = { ...props };

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`
    });

    const fragment = document.createElement('template');
    fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      stub?.replaceWith(child.getContent()!);
    });

    return fragment.content;
  }

  public getContent(): HTMLElement | null {
    return this.element;
  }

  private _makePropsProxy(initialProps: Props): Props {
    return new Proxy(initialProps, {
      get: (target, prop) => {
        const value = target[prop as string];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set: (target, prop, value: unknown): boolean => {
        const oldProps = { ...target };
        target[prop as string] = value;
        this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, target);
        return true;
      },
      deleteProperty: (): boolean => {
        throw new Error('нет доступа');
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  public show(): void {
    if (this._element) {
      this._element.style.display = 'block';
    }
  }

  public hide(): void {
    if (this._element) {
      this._element.style.display = 'none';
    }
  }
}
