export default class ItalicTool {
  constructor($button, toolbar) {
    this.$button = $button;
    this.toolbar = toolbar;
  }

  get name() {
    return "Italic";
  }

  get shortcut() {
    return [["meta+73", "meta+i"], ["ctrl+73", "ctrl+i"]];
  }

  get icon() {
    return `<svg height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="M0 0h24v24H0z"fill=none /><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"fill=currentFill /></svg>`;
  }

  surround() {
    document.execCommand("italic");
  }

  checkState() {
    const active = document.queryCommandState("italic");
    this.$button.classList[active ? "add" : "remove"]("active");
  }
}
