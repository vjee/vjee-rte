import Selection from "./../Selection";

export default class CustomTool {
  constructor($button, toolbar) {
    this.$button = $button;
    this.toolbar = toolbar;
  }

  surround() {
    const range = Selection.range;
    const $wrapper = Selection.findParentTag(this.nodeName.toUpperCase());

    if ($wrapper) {
      this.unwrap($wrapper);
    } else {
      this.wrap(range);
    }

    this.checkState();
  }

  wrap(range) {
    const $wrapper = document.createElement(this.nodeName);

    $wrapper.appendChild(range.extractContents());
    range.insertNode($wrapper);
    Selection.expandToTag($wrapper);
  }

  unwrap($wrapper) {
    Selection.expandToTag($wrapper);

    const range = Selection.range;
    const $unwrappedContent = range.cloneContents();
    range.extractContents();

    $wrapper.parentNode.removeChild($wrapper);
    range.insertNode($unwrappedContent);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  checkState() {
    const $wrapper = Selection.findParentTag(this.nodeName.toUpperCase());

    if ($wrapper) {
      this.$button.classList.add("active");
    } else {
      this.$button.classList.remove("active");
    }
  }
}
