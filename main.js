import { Component, createToyElement, DomRender } from './toy-react'

class MyComponent extends Component {
  render() {
    return <div>
      <div>MyComponent</div>
      {this.children}
    </div>
  }
}

DomRender(<MyComponent class='main'>
  <div>hello
  <div>world</div>, <div>world</div>
  </div>
  {[<div>world</div>, <div>world</div>]}
  <div>!</div>
</MyComponent>, document.body)