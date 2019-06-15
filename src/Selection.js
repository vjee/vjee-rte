export default class Selection {
  static findParentTag(tagName, className = null, searchDepth = 10) {
    const selection = Selection.selection;
    let $parentTag = null;

    if (!selection || !selection.anchorNode || !selection.focusNode) {
      return null;
    }

    const boundNodes = [selection.anchorNode, selection.focusNode];

    boundNodes.forEach($parent => {
      let searchDepthIterable = searchDepth;

      while (searchDepthIterable > 0 && $parent.parentNode) {
        if ($parent.tagName === tagName) {
          $parentTag = $parent;

          if (
            className &&
            $parent.classList &&
            !$parent.classList.contains(className)
          ) {
            $parentTag = null;
          }

          if ($parentTag) break;
        }

        $parent = $parent.parentNode;
        searchDepthIterable--;
      }
    });

    return $parentTag;
  }

  static expandToTag($node) {
    const selection = Selection.selection;

    selection.removeAllRanges();
    const range = document.createRange();

    range.selectNodeContents($node);
    selection.addRange(range);
  }

  static get selection() {
    return window.getSelection();
  }

  static get text() {
    return Selection.selection.toString();
  }

  static get range() {
    const selection = Selection.selection;
    return selection && selection.rangeCount ? selection.getRangeAt(0) : null;
  }

  static get rect() {
    let rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    const selection = Selection.selection;
    const range = selection.getRangeAt(0).cloneRange();

    if (range.getBoundingClientRect) {
      rect = range.getBoundingClientRect();
    }

    return rect;
  }
}
