export default class Selection {
  constructor() {
    this.savedSelectionRange = null;
    this.isFakeBackgroundEnabled = false;
  }

  static get() {
    return window.getSelection();
  }

  save() {
    this.savedSelectionRange = Selection.range;
  }

  restore() {
    if (!this.savedSelectionRange) {
      return;
    }

    const sel = window.getSelection();

    sel.removeAllRanges();
    sel.addRange(this.savedSelectionRange);
  }

  static findParentTag(tagName, className = null, searchDepth = 10) {
    const sel = window.getSelection();
    let parentTag = null;

    if (!sel || !sel.anchorNode || !sel.focusNode) {
      return null;
    }

    const boundNodes = [sel.anchorNode, sel.focusNode];

    boundNodes.forEach(parent => {
      let searchDepthIterable = searchDepth;

      while (searchDepthIterable > 0 && parent.parentNode) {
        if (parent.tagName === tagName) {
          parentTag = parent;

          if (
            className &&
            parent.classList &&
            !parent.classList.contains(className)
          ) {
            parentTag = null;
          }

          if (parentTag) {
            break;
          }
        }

        parent = parent.parentNode;
        searchDepthIterable--;
      }
    });

    return parentTag;
  }

  static expandToTag(element) {
    const sel = window.getSelection();

    sel.removeAllRanges();
    const range = document.createRange();

    range.selectNodeContents(element);
    sel.addRange(range);
  }

  static get text() {
    return window.getSelection ? window.getSelection().toString() : "";
  }

  static get range() {
    const sel = window.getSelection();

    return sel && sel.rangeCount ? sel.getRangeAt(0) : null;
  }

  static get rect() {
    let rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    const sel = window.getSelection();
    const range = sel.getRangeAt(0).cloneRange();

    if (range.getBoundingClientRect) {
      rect = range.getBoundingClientRect();
    }

    return rect;
  }
}
