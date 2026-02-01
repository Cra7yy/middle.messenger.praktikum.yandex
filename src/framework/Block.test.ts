import Block from './Block';
import EventBus from './EventBus';

jest.mock('./EventBus');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123')
}));

describe('Block', () => {
  let TestBlock: typeof Block;
  let mockEventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    jest.clearAllMocks();

    (EventBus as jest.MockedClass<typeof EventBus>).mockImplementation(() => {
      const listeners: Record<string, ((...args: unknown[]) => void)[]> = {};

      const bus = {
        on: jest.fn((event, callback) => {
          if (!listeners[event]) {
            listeners[event] = [];
          }
          listeners[event].push(callback);
        }),
        off: jest.fn((event, callback) => {
          if (!listeners[event]) return;
          listeners[event] = listeners[event].filter(fn => fn !== callback);
        }),
        emit: jest.fn((event, ...args) => {
          if (listeners[event]) {
            listeners[event].forEach(fn => fn(...args));
          }
        }),
      } as unknown as jest.Mocked<EventBus>;

      mockEventBus = bus;

      return bus;
    });

    document.body.innerHTML = '';

    class TestComponent extends Block {
      render() {
        return '<div>Test content</div>';
      }
    }
    TestBlock = TestComponent;
  });

  describe('Конструктор', () => {
    it('должен создать экземпляр Block с tagName по умолчанию', () => {
      const block = new TestBlock();
      expect(block).toBeInstanceOf(Block);
    });

    it('должен создать экземпляр с переданным tagName', () => {
      const block = new TestBlock('span');
      expect(block).toBeInstanceOf(Block);
    });

    it('должен зарегистрировать события в EventBus', () => {
      new TestBlock();
      expect(mockEventBus.on).toHaveBeenCalledWith('init', expect.any(Function));
      expect(mockEventBus.on).toHaveBeenCalledWith('flow:component-did-mount', expect.any(Function));
      expect(mockEventBus.on).toHaveBeenCalledWith('flow:render', expect.any(Function));
      expect(mockEventBus.on).toHaveBeenCalledWith('flow:component-did-update', expect.any(Function));
    });

    it('должен вызвать событие INIT', () => {
      new TestBlock();
      expect(mockEventBus.emit).toHaveBeenCalledWith('init');
    });

    it('должен разделить props и children', () => {
      const childBlock = new TestBlock();
      jest.spyOn(childBlock, 'dispatchComponentDidMount').mockImplementation(() => {});

      const block = new TestBlock('div', {
        someProp: 'value',
        child: childBlock
      });

      expect(block.props.someProp).toBe('value');
      expect(block.children.child).toBe(childBlock);
    });
  });

  describe('setProps', () => {
    it('должен обновить props', () => {
      const block = new TestBlock('div', { prop1: 'value1' });
      block.setProps({ prop2: 'value2' });
      expect(block.props.prop2).toBe('value2');
    });

    it('не должен падать при передаче null', () => {
      const block = new TestBlock();
      expect(() => block.setProps(null)).not.toThrow();
    });

    it('должен вызвать событие CDU при изменении props через proxy', () => {
      const block = new TestBlock('div', { prop1: 'value1' });
      mockEventBus.emit.mockClear();
      block.props.prop1 = 'new value';
      expect(mockEventBus.emit).toHaveBeenCalledWith('flow:component-did-update', expect.any(Object), expect.any(Object));
    });
  });

  describe('componentDidUpdate', () => {
    it('должен возвращать true по умолчанию', () => {
      const block = new TestBlock();
      const result = block.componentDidUpdate({}, {});
      expect(result).toBe(true);
    });
  });

  describe('show и hide', () => {
    it('должен показать элемент', () => {
      const block = new TestBlock();
      block.init();
      block.show();
      expect(block.element?.style.display).toBe('block');
    });

    it('должен скрыть элемент', () => {
      const block = new TestBlock();
      block.init();
      block.hide();
      expect(block.element?.style.display).toBe('none');
    });

    it('не должен падать если element null', () => {
      const block = new TestBlock();
      expect(() => block.show()).not.toThrow();
      expect(() => block.hide()).not.toThrow();
    });
  });

  describe('getContent', () => {
    it('должен вернуть element', () => {
      const block = new TestBlock();
      block.init();
      expect(block.getContent()).toBe(block.element);
    });
  });

  describe('dispatchComponentDidMount', () => {
    it('должен вызвать событие FLOW_CDM', () => {
      const block = new TestBlock();
      mockEventBus.emit.mockClear();
      block.dispatchComponentDidMount();
      expect(mockEventBus.emit).toHaveBeenCalledWith('flow:component-did-mount');
    });
  });

  describe('compile', () => {
    it('должен скомпилировать шаблон с props', () => {
      const block = new TestBlock('div', { text: 'Hello' });
      const template = '<div>{{text}}</div>';
      const fragment = block.compile(template, block.props);
      expect(fragment.firstElementChild?.textContent).toBe('Hello');
    });

    it('должен заменить заглушки children на реальные элементы', () => {
      const childBlock = new TestBlock('span', { text: 'Child' });
      childBlock.init();
      jest.spyOn(childBlock, 'dispatchComponentDidMount').mockImplementation(() => {});

      const parentBlock = new TestBlock('div', { child: childBlock });
      const template = '<div>{{{child}}}</div>';
      const fragment = parentBlock.compile(template, parentBlock.props);
      expect(fragment.textContent).toContain('Test content');
    });
  });

  describe('Работа с events', () => {
    it('должен добавить обработчики событий', () => {
      const clickHandler = jest.fn();
      const block = new TestBlock('div', {
        events: {
          click: clickHandler
        }
      });

      block.init();

      block.element?.click();
      expect(clickHandler).toHaveBeenCalled();
    });
  });
});
