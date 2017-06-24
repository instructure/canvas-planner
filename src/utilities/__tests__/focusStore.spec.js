import { FocusStore } from '../focusStore';

describe('setItemToFocus', () => {
  it('throws if you try setting something that does not have a focus method', () => {
    const focusStore = new FocusStore();
    expect(() => {
      focusStore.setItemToFocus({});
    }).toThrow();
  });

  it('sets the itemToFocus', () => {
    const focusStore = new FocusStore();
    const fakeElement = { focus () {} };
    focusStore.setItemToFocus(fakeElement);
    expect(focusStore.itemToFocus).toEqual(fakeElement);
  });
});

describe('focus', () => {
  it('calls the focus method of the itemToFocus', () => {
    const focusStore = new FocusStore();
    const fakeElement = {
      focus: jest.fn()
    };
    focusStore.setItemToFocus(fakeElement);
    focusStore.focus();
    expect(fakeElement.focus).toHaveBeenCalled();
  });

  it('throws if nothing has been set to be focused', () => {
    const focusStore = new FocusStore();
    expect(() => {
      focusStore.focus();
    }).toThrow();
  });

  it('sets the itemToFocus to null after being called', () => {
    const focusStore = new FocusStore();
    const fakeElement = {
      focus: jest.fn()
    };
    focusStore.setItemToFocus(fakeElement);
    focusStore.focus();
    expect(focusStore.itemToFocus).toBe(null);
  });
});
