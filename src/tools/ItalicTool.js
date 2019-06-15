import NativeTool from "./../classes/NativeTool";

export default class ItalicTool extends NativeTool {
  constructor($button, toolbar) {
    super($button, toolbar);

    this.name = "Italic";
    this.commandName = "italic";
    this.shortcut = [["meta+73", "meta+i"], ["ctrl+73", "ctrl+i"]];

    this.icon = `<svg height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="M0 0h24v24H0z"fill=none /><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"fill=currentFill /></svg>`;
  }
}
