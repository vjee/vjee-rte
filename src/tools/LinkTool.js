import Selection from "./../Selection";

export default class LinkTool {
  constructor($button, toolbar) {
    this.$button = $button;
    this.toolbar = toolbar;

    this.name = "Link";
    this.nodeName = "a";
    this.shortcut = ["meta+k", "ctrl+k"];

    this.icon = `<svg height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="M0 0h24v24H0z"fill=none /><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"fill=currentFill /></svg>`;
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
    const href = prompt("Link", "https://");
    document.execCommand("createLink", false, href);
  }

  unwrap($wrapper) {
    Selection.expandToTag($wrapper);
    document.execCommand("unlink");
  }

  checkState() {
    const $wrapper = Selection.findParentTag("A");

    if ($wrapper) {
      this.$button.classList.add("active");
    } else {
      this.$button.classList.remove("active");
    }
  }
}
