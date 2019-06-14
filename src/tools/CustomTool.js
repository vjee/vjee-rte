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
    const $marker = document.createElement(this.nodeName);

    $marker.appendChild(range.extractContents());
    range.insertNode($marker);

    Selection.expandToTag($marker);
  }

  unwrap($wrapper) {
    Selection.expandToTag($wrapper);

    const range = Selection.range;
    const $unwrappedContent = range.extractContents();

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
