function createToyElement(tagName, attributes, ...children) {
  const element = document.createElement(tagName);
  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      const value = attributes[key];
      element.setAttribute(key, value)
    }
  }
  for (let child of children) {
    if (typeof child === 'string') {
      child = document.createTextNode(child)
    }
    element.appendChild(child)
  }
  return element
}
document.body.appendChild(<div id='king' class='main'>
  <div>hello</div>
  <div>world</div>
  <div>!</div>
</div>)