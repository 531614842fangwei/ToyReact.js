/**
 * 这两个wrapper看似什么也没干，并且完全可以不通过class来完成
 * 但是最最主要的是为了实例上的root属性，
 * 用以标识出节点已经到了浏览器可以直接渲染的地步
 */

class ElementWrapper {
  constructor(tagName) {
    this.root = document.createElement(tagName)
  }
  setAttribute(key, value) {
    this.root.setAttribute(key, value)
  }
  appendChild(component) {
    // 注意：调用的是component.root
    this.root.appendChild(component.root)
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
}

export class Component {
  constructor() {
    // 不使用{}，是因为避免原型污染
    this.props = Object.create(null)
    this.children = []
  }
  setAttribute(key, value) {
    this.props[key] = value
  }
  appendChild(child) {
    this.children.push(child)
  }
  /**
   * 最为关键的一个步骤
   * getter 方法，如果这个对象上没有root，那么调用render返回的root
   * */
  get root() {
    if (!this._root) {
      this._root = this.render().root
      return this._root
    }
    return this._root
  }

}

export function createToyElement(type, attributes, ...children) {
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
      if (typeof child === 'object' && child instanceof Array) {
        console.error(child)
        /**
         * 这里感觉最多出现一次递归，不存在视频中说的数组套数组
         * div嵌套也只是createToyElement嵌套，并非节点数据直接产生多维数组
         * 除非～～～{[<div>, <div>]}
         *
         * 思路fix: 最常用的map会出现上述情况，极其频繁
         * btw 想法保留
         * */
        insertChildren(child)
        return
      }
      if (typeof child === 'string') {
        child = new TextWrapper(child)
      }
      element.appendChild(child)
    }
  }
  insertChildren(children)

  return element
}

export function DomRender(component, parentElement) {
  // 注意：调用的是component.root
  parentElement.appendChild(component.root)
}
