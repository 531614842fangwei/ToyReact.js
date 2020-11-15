import ToyReact, { Component } from './toy-react'
import ToyReactDom from './toy-react-dom'

class MyComponent extends Component {
  constructor() {
    super();
    this.state = {
      a: 1
    }
  }
  render() {
    return <div>
      <h1>MyComponent</h1>
      <div>
        <span>{this.state.a.toString()}</span>
        <button onClick={() => {
          this.state.a++; this.rerender()
        }}>+</button>
      </div>
      {this.children}
    </div>
  }
}

ToyReactDom.render(<MyComponent class='main'>
  {[<span>hello </span>,
  <span>world!</span>]}
</MyComponent>, document.body)