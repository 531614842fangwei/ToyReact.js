for (let i of [1, 2, 3]) {
  console.log(i)
}

function createToyElement(tagName, attribute, ...children) {
  return document.createElement(tagName)
}

window.a = <div></div>