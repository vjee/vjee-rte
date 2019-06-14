import combi from "combi/src";
import Selection from "./Selection";
import Toolbar from "./Toolbar";

export default function create($node) {
  if (typeof $node === "string") {
    $node = document.querySelector($node);
  }

  const selection = new Selection();
  const toolbar = new Toolbar($node, selection);

  const keydown = combi(shortcut => {
    if (toolbar.shortcuts[shortcut]) toolbar.shortcuts[shortcut]();
  });

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
