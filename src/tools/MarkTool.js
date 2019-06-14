import CustomTool from "./CustomTool";

export default class MarkTool extends CustomTool {
  constructor($button, toolbar) {
    super($button, toolbar);

    this.name = "Mark";
    this.nodeName = "mark";
    this.shortcut = ["alt+meta+h", "ctrl-alt-h"];

    this.icon = `<svg height=20 viewBox="0 0 24 18"width=20 xmlns=http://www.w3.org/2000/svg><path d="M17.75 7L14 3.25l-10 10V17h3.75l10-10zm2.96-2.96c.39-.39.39-1.02 0-1.41L18.37.29c-.39-.39-1.02-.39-1.41 0L15 2.25 18.75 6l1.96-1.96z"fill=currentFill /><path d="M0 0h24v24H0z"fill=none /></svg>`;
  }
}
