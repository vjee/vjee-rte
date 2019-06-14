/**
 * @vjee/rte v0.1.0-alpha.0
 * (c) 2019-2019 vjee
 * Released under the MIT License.
 */
function combi (cb, preventDefault = false) {
  return (e) => {
    if (!e) return
    if (preventDefault) e.preventDefault();

    let combo = [
      e.ctrlKey ? 'ctrl' : undefined,
      e.altKey ? 'alt' : undefined,
      e.shiftKey ? 'shift' : undefined,
      e.metaKey ? 'meta' : undefined,
      ['Shift', 'Meta', 'Control', 'Option', 'Alt'].indexOf(e.key) >= 0 ? undefined : e.code.replace(/Key|Digit/, '')
    ].filter(Boolean);

    if (combo.length >= 2) {
      if (cb) {
        cb(combo.join('+').toLowerCase(), e);
      }
    }
  }
}

class Selection {
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

class CustomTool {
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

class BoldTool extends CustomTool {
  constructor($button, toolbar) {
    super($button, toolbar);

    this.name = "Bold";
    this.nodeName = "b";
    this.shortcut = ["meta+b", "ctrl+b"];

    this.icon = `<svg height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"fill=currentFill /><path d="M0 0h24v24H0z"fill=none /></svg>`;
  }
}

class ItalicTool extends CustomTool {
  constructor($button, toolbar) {
    super($button, toolbar);

    this.name = "Italic";
    this.nodeName = "i";
    this.shortcut = ["meta+i", "ctrl-i"];

    this.icon = `<svg height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="M0 0h24v24H0z"fill=none /><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"fill=currentFill /></svg>`;
  }
}

class MarkTool extends CustomTool {
  constructor($button, toolbar) {
    super($button, toolbar);

    this.name = "Mark";
    this.nodeName = "mark";
    this.shortcut = ["alt+meta+h", "ctrl-alt-h"];

    this.icon = `<svg height=20 viewBox="0 0 24 24"width=20 xmlns=http://www.w3.org/2000/svg><path d="M17.75 7L14 3.25l-10 10V17h3.75l10-10zm2.96-2.96c.39-.39.39-1.02 0-1.41L18.37.29c-.39-.39-1.02-.39-1.41 0L15 2.25 18.75 6l1.96-1.96z"fill=currentFill /><path d="M0 0h24v24H0z"fill=none /><path d="M0 20h24v4H0z"fill=currentFill fill-opacity=.36 /></svg>`;
  }
}

class LinkTool {
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
    const href = prompt("Link location:");
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

class Toolbar {
  constructor($node, selection) {
    this.toolInstances = [];
    this.shortcuts = {};

    this.$node = $node;
    this.selection = selection;

    this.$toolbar = this.createToolbar();

    this.isMac = navigator.platform.indexOf("Mac") === 0;

    [BoldTool, ItalicTool, MarkTool, LinkTool].forEach(Tool => {
      const $button = this.createToolbarButton(Tool);
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

  createToolbarButton(Tool) {
    const $button = document.createElement("button");
    $button.classList.add("vjee-rte__toolbar__button");

    const tool = new Tool($button, this);
    this.toolInstances.push(tool);

    $button.title = tool.name;
    $button.innerHTML = tool.icon;

    $button.addEventListener("click", () => {
      tool.surround();
    });

    if (tool.shortcut) {
      const combination = this.isMac ? tool.shortcut[0] : tool.shortcut[1];
      const combinationName = this.isMac
        ? combination.replace("meta", "⌘").replace("alt", "⌥")
        : combination;

      this.shortcuts[combination] = () => tool.surround();
      $button.title = `${tool.name} (${combinationName.toUpperCase()})`;
    }

    return $button;
  }

  allowedToShow() {
    const currentSelection = Selection.get();
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

function create($node) {
  if (typeof $node === "string") {
    $node = document.querySelector($node);
  }

  const selection = new Selection();
  const toolbar = new Toolbar($node, selection);

  const keydown = combi(shortcut => {
    console.log(shortcut);
    if (toolbar.shortcuts[shortcut]) toolbar.shortcuts[shortcut]();
  }, true);

  function select() {
    if (!toolbar.allowedToShow()) return toolbar.close();

    selection.save();

    toolbar.move();
    toolbar.open();
    toolbar.checkStates();
  }

  $node.classList.add("vjee-rte");
  $node.contentEditable = "true";

  window.addEventListener("mouseup", select);
  window.addEventListener("keyup", select);
  window.addEventListener("keydown", keydown);

  return function destroy() {
    $node.classList.remove("vjee-rte");
    $node.contentEditable = "false";

    window.removeEventListener("mouseup", select);
    window.removeEventListener("keyup", select);
    window.removeEventListener("keydown", keydown);

    toolbar.destroy();
  };
}

export default create;
