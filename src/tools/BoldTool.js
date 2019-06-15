export default class BoldTool {
  constructor($button, toolbar) {
    this.$button = $button;
    this.toolbar = toolbar;
  }

  get name() {
    return "Bold";
  }

  get shortcut() {
    return [["meta+66", "meta+b"], ["ctrl+66", "ctrl+b"]];
  }

  get icon() {
    return `<svg height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"fill=currentFill /><path d="M0 0h24v24H0z"fill=none /></svg>`;
  }

  surround() {
    document.execCommand("bold");
  }

  checkState() {
    const active = document.queryCommandState("bold");
    this.$button.classList[active ? "add" : "remove"]("active");
  }
}
