export class Component {
  constructor() {
    // 不使用{}，是因为避免原型污染
    this.props = Object.create(null)
    this.children = []
    this._root = null
    this._range = null
  }
  setAttribute(key, value) {
    this.props[key] = value
  }
  appendChild(child) {
    this.children.push(child)
  }
  get vdom() {
    return this.render().vdom
  }

  // get vchildren() {
  //   return this.children.map(child => child.vdom)
  // }

  update() {
    let isSameNode = (oldNode, newNode) => {
      if (oldNode.type !== newNode.type) {
        return false
      }
      for (const key in newNode.props) {
        if (newNode.props[key] !== oldNode.props[key]) {
          return false
        }
      }
      if (Object.keys(oldNode.props).length > Object.keys(newNode.props).length) {
        return false
      }
      if (newNode.type === '#text') {
        if (newNode.content !== oldNode.content)
          return false
      }
      return true
    }

    let update = (oldNode, newNode) => {

      if (!isSameNode(oldNode, newNode)) {
        newNode._renderToDOM(oldNode._range)
        return
      }
      newNode._range = oldNode._range

      let newChildren = newNode.vchildren;
      let oldChildren = oldNode.vchildren;

      if (!newChildren || !newChildren.length) { return }

      let tailRange = oldChildren[oldChildren.length - 1]._range;

      for (let i = 0; i < newChildren.length; i++) {
        let newChild = newChildren[i]
        let oldChild = oldChildren[i]
        if (i < oldChildren.length) {
          update(oldChild, newChild)
        } else {
          let range = document.createRange();
          range.setStart(tailRange.endContainer, tailRange.endOffset)
          range.setEnd(tailRange.endContainer, tailRange.endOffset)
          newChild._renderToDOM(range)
          tailRange = range
        }
      }

    }

    let vdom = this.vdom
    update(this._vdom, vdom);
    this._vdom = vdom
  }

  /**
   * 使用root的方式不支持或者说是难以支持节点的改变
   * 所以需要一个新的方法，同样做了递归
   * (不使用symbol以免影响思路连贯性)
   * */
  _renderToDOM(range) {
    this._range = range;
    this._vdom = this.vdom
    this._vdom._renderToDOM(range)
  }

  // rerender() {
  //   // 这里面的新旧range替换，先替换再移位再删除，只是为了处理range的bug
  //   // 本地没有出现这个bug，后续也用不到，不用太在意
  //   const oldRange = this._range
  //   let range = document.createRange();
  //   range.setStart(oldRange.startContainer, oldRange.startOffset);
  //   range.setEnd(oldRange.startContainer, oldRange.startOffset);
  //   this._renderToDOM(range)
  //   oldRange.setStart(range.endContainer, range.endOffset)
  //   oldRange.deleteContents();
  // }

  /**
   * 只管merge，没有diff
   * @param {*} newState
   */
  setState(newState) {
    if (this.state === null || typeof this.state !== 'object') {
      this.state = newState
      this.update()
      return;
    }
    let merge = (oldState, newState) => {
      for (const p in newState) {
        if (newState.hasOwnProperty(p)) {
          if (oldState[p] === null || typeof oldState[p] !== 'object') {
            oldState[p] = newState[p]
          } else {
            merge(oldState[p], newState[p])
          }
        }
      }

    }
    merge(this.state, newState)
    this.update()
  }
  /**
   * 最为关键的一个步骤
   * getter 方法，如果这个对象上没有root，那么调用render返回的root
   * */
  // get root() {
  //   if (!this._root) {
  //     this._root = this.render().root
  //     return this._root
  //   }
  //   return this._root
  // }
}
/**
 * 这两个wrapper看似什么也没干，并且完全可以不通过class来完成
 * 但是最最主要的是为了实例上的root属性，
 * 用以标识出节点已经到了浏览器可以直接渲染的地步
 */
class ElementWrapper extends Component {
  constructor(type) {
    super(type)
    this.type = type
    // this.root = document.createElement(type)
  }
  // setAttribute(key, value) {
  //   if (key.match(/^on([\s\S]+)$/)) {
  //     this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
  //   } else {
  //     if (key === 'className') {
  //       this.root.setAttribute('class', value)
  //       return
  //     }
  //     this.root.setAttribute(key, value)
  //   }
  // }
  // appendChild(component) {
  //   // // 注意：调用的是component.root
  //   // this.root.appendChild(component.root)
  //   let range = document.createRange();
  //   range.setStart(this.root, this.root.childNodes.length)
  //   range.setEnd(this.root, this.root.childNodes.length)
  //   component._renderToDOM(range)
  // }
  get vdom() {
    this.vchildren = this.children.map(child => child.vdom)
    return this
    // return {
    //   type: this.type,
    //   props: this.props,
    //   children: this.children
    // }
  }

  _renderToDOM(range) {
    this._range = range
    let root = document.createElement(this.type)
    for (const key in this.props) {
      const value = this.props[key];
      if (key.match(/^on([\s\S]+)$/)) {
        root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
      } else {
        if (key === 'className') {
          root.setAttribute('class', value)
        } else {
          root.setAttribute(key, value)
        }
      }
    }

    if (!this.vchildren) {
      this.vchildren = this.children.map(child => child.vdom)
    }
    for (const child of this.vchildren) {
      let childRange = document.createRange();
      childRange.setStart(root, root.childNodes.length)
      childRange.setEnd(root, root.childNodes.length)
      child._renderToDOM(childRange)
    }

    replaceContent(range, root)
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super(content)
    this.type = '#text'
    this.content = content
  }
  get vdom() {
    return this
    // return {
    //   type: this.type,
    //   content: this.content
    // }
  }
  _renderToDOM(range) {
    this._range = range
    let root = document.createTextNode(this.content)
    replaceContent(range, root)
  }
}

function replaceContent(range, node) {
  range.insertNode(node)
  range.setStartAfter(node)
  range.deleteContents()

  range.setStartBefore(node)
  range.setEndAfter(node)
}

function createElement(type, attributes, ...children) {
  let element
  /**
   *  jsx将小写解析为string、大写解析为class
   * （实践证明，并非通过合法类型集合判定，只要是小写都是string类型）
   * */
  if (typeof type === 'string') {
    element = new ElementWrapper(type);
  } else {
    element = new type;
  }
  /**
   * 以下部分有两个关键方法 setAttribute 和 appendChild
   * 如果不是由document.createElement创造出来的，是不可能带有这两个方法的。
   * 除非～～～所写的class中默认带有这两个方法。
   * */
  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      const value = attributes[key];
      element.setAttribute(key, value)
    }
  }
  const insertChildren = (children) => {
    for (let child of children) {
      if (typeof child === 'string') {
        child = new TextWrapper(child)
      }
      if (child === null) {
        continue
      }
      if (typeof child === 'object' && child instanceof Array) {
        /**
         * 这里感觉最多出现一次递归，不存在视频中说的数组套数组
         * div嵌套也只是createElement嵌套，并非节点数据直接产生多维数组
         * 除非～～～{[<div>, <div>]}
         *
         * 思路fix: 最常用的map会出现上述情况，极其频繁
         * btw 想法保留
         * */
        insertChildren(child)
      } else {
        element.appendChild(child)
      }
    }
  }
  insertChildren(children)

  return element
}

const ToyReact = {
  Component,
  createElement,
}

export default ToyReact
