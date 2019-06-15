import Selection from "./classes/Selection";
import Toolbar from "./classes/Toolbar";

function combi(cb, preventDefault = false) {
  return e => {
    if (!e) return;
    if (preventDefault) e.preventDefault();

    let combo = [
      e.ctrlKey ? "ctrl" : undefined,
      e.altKey ? "alt" : undefined,
      e.shiftKey ? "shift" : undefined,
      e.metaKey ? "meta" : undefined,
      ["Shift", "Meta", "Control", "Option", "Alt"].indexOf(e.key) >= 0
        ? undefined
        : e.keyCode
    ].filter(Boolean);

    if (combo.length >= 2) {
      if (cb) {
        cb(combo.join("+"), e);
      }
    }
  };
}

export default function create($node) {
  if (typeof $node === "string") {
    $node = document.querySelector($node);
  }

  const selection = new Selection();
  const toolbar = new Toolbar($node, selection);

  const keydown = combi((shortcut, event) => {
    if (toolbar.shortcuts[shortcut]) {
      event.preventDefault();
      toolbar.shortcuts[shortcut]();
    }
  });

  function select(event) {
    if (event.target.closest(".vjee-rte__toolbar__button")) return;
    if (!toolbar.allowedToShow()) return toolbar.close();

    // selection.save();

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
