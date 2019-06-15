export default class NativeTool {
  constructor($button, toolbar) {
    this.$button = $button;
    this.toolbar = toolbar;
  }

  surround() {
    document.execCommand(this.commandName);
  }

  checkState() {
    const active = document.queryCommandState(this.commandName);
    this.$button.classList[active ? "add" : "remove"]("active");
  }
}
