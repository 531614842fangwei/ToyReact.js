import ToyReact, { Component } from './toy-react'
import ToyReactDom from './toy-react-dom'

class MyComponent extends Component {
  render() {
    return <div>
      <div>MyComponent</div>
      {this.children}
    </div>
  }
}

ToyReactDom.render(<MyComponent class='main'>
  <div>hello</div>
  <div>world</div>
  <div>!</div>
</MyComponent>, document.body)