/**
 * Handles focusing elements when needed between different places
 */
export class FocusStore {
  itemToFocus = null;

  setItemToFocus (item) {
    if (typeof item.focus !== "function") {
      throw new Error('Focus Store: You can only set items to focus that have a focus method.');
    }
    this.itemToFocus = item;
  }

  focus () {
    if (this.itemToFocus == null) {
      throw new Error('Focus Store: You need to set an item before it can be focused.');
    }
    this.itemToFocus.focus();
    this.itemToFocus = null;
  }
}

const focusStore = new FocusStore();
export default focusStore;
