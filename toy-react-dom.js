export default {
  render: function (component, parentElement) {
    // 注意：调用的是component.root
    // parentElement.appendChild(component.root)

    let range = document.createRange();
    range.setStart(parentElement, 0);
    range.setEnd(parentElement, parentElement.childNodes.length)
    range.deleteContents();
    component._renderToDOM(range)
  }
}