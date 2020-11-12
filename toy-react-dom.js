export default {
  render: function (component, parentElement) {
    // 注意：调用的是component.root
    parentElement.appendChild(component.root)
  }
}