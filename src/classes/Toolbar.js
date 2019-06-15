import Selection from "./Selection";
import BoldTool from "../tools/BoldTool";
import ItalicTool from "../tools/ItalicTool";
import UnderlineTool from "../tools/UnderlineTool";
import MarkTool from "../tools/MarkTool";
import LinkTool from "../tools/LinkTool";

export default class Toolbar {
  constructor($node, selection) {
    this.toolInstances = [];
    this.shortcuts = {};

    this.$node = $node;
    this.selection = selection;

    this.$toolbar = this.createToolbar();

    this.isMac = navigator.platform.toLowerCase().indexOf("mac") === 0;

    [BoldTool, ItalicTool, UnderlineTool, MarkTool, LinkTool].forEach(Tool => {
      const $button = this.createTool(Tool);
      this.$toolbar.firstChild.appendChild($button);
    });

    document.body.appendChild(this.$toolbar);
  }

  createToolbar() {
    const $toolbar = document.createElement("div");
    $toolbar.classList.add("vjee-rte__toolbar");
    $toolbar.classList.add("vjee-rte__toolbar--hidden");

    const $buttons = document.createElement("div");
    $buttons.classList.add("vjee-rte__toolbar__buttons");
    $toolbar.appendChild($buttons);

    return $toolbar;
  }

  createTool(Tool) {
    const $button = document.createElement("button");
    $button.classList.add("vjee-rte__toolbar__button");

    const tool = new Tool($button, this);
    this.toolInstances.push(tool);

    $button.title = tool.name;
    $button.innerHTML = tool.icon;

    $button.addEventListener("click", () => {
      tool.surround();
      this.checkStates();
    });

    if (tool.shortcut) {
      const { keys, label } = this.parseShortcut(tool.shortcut);

      this.shortcuts[keys] = () => {
        tool.surround();
        this.checkStates();
      };
      $button.title = `${tool.name} (${label})`;
    }

    return $button;
  }

  parseShortcut(shortcut) {
    shortcut = shortcut[this.isMac ? 0 : 1];

    const keys = shortcut[0];
    let label = shortcut[1].replace("meta", this.isMac ? "⌘" : "⊞");

    if (this.isMac) {
      label = label
        .replace("ctrl", "⌃")
        .replace("alt", "⌥")
        .replace("shift", "⇧")
        .replace(/\+/g, "");
    }

    return {
      keys,
      label: label.toUpperCase()
    };
  }

  allowedToShow() {
    const currentSelection = Selection.selection;
    const selectedText = Selection.text;

    if (currentSelection.isCollapsed || selectedText.length < 1) {
      return false;
    }

    const $target = currentSelection.anchorNode.parentElement;
    const selectionWithinNode = this.$node.contains($target);

    if (!selectionWithinNode) {
      return false;
    }

    return true;
  }

  checkStates() {
    this.toolInstances.forEach(tool => {
      if (tool.checkState) tool.checkState();
    });
  }

  move() {
    const selectionRect = Selection.rect;

    const newCoords = {
      x: selectionRect.left + selectionRect.width / 2,
      y: selectionRect.top + selectionRect.height
    };

    this.$toolbar.style.left = Math.floor(newCoords.x) + "px";
    this.$toolbar.style.top = Math.floor(newCoords.y) + "px";
  }

  open() {
    this.$toolbar.classList.remove("vjee-rte__toolbar--hidden");
  }

  close() {
    this.$toolbar.classList.add("vjee-rte__toolbar--hidden");

    this.toolInstances.forEach(tool => {
      if (tool.clearUI) tool.clearUI();
    });
  }

  destroy() {
    this.$toolbar.parentNode.removeChild(this.$toolbar);
  }
}
