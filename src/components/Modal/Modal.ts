import template from './Modal.hbs?raw';
import './Modal.scss';
import Block from '../../framework/Block.ts';
import type { ModalType } from '../../type/modal.type.ts';

export class Modal extends Block {
  constructor(props: ModalType) {
    const { Input, ...rest } = props;

    super('div', {
      ...rest,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          const submitBtn = target.closest('.modal__button');
          if (submitBtn) {
            const { onSubmit } = this.props as unknown as ModalType;
            if (onSubmit) {
              onSubmit();
            }
          }
        }
      }
    });

    this.children = {
      ...(this.children || {}),
      Input,
    };
  }

  render() {
    const propsForTemplate = { ...(this.props as unknown as ModalType) };
    delete (propsForTemplate as Record<string, unknown>).events;
    return this.compile(template, propsForTemplate);
  }
}
