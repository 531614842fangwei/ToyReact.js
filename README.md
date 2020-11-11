## 配置webpack和用真DOM实现伪React
1. 配置webpack
2. 跳过jsx解析的实现（使用了transform-react-jsx),猜测涉及编译原理。
3. 自写createToyElement(tagName, attributes, ...children)方法
4. 循环处理 attributes，children
5. 处理textNode
6. 挂载到body上

## 自定义组件的支持
1. 抽离关键方法到另一个文件
2. 将元素节点和文本节点抽象成class的实例，并有root属性来标识
3. 写一个自带setAttribute和appendChild的通用Component类
4. 关键点：getter root 方法来返回非抽象节点（有root属性）
5. 递归处理children为数组的情况
6. 改写DomRender方法