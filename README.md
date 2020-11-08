## 配置webpack和用真DOM实现伪React
1. 配置webpack
2. 跳过jsx解析的实现（使用了transform-react-jsx),猜测涉及编译原理。
3. 自写createToyElement(tagName, attributes, ...children)方法
4. 循环处理 attributes，children
5. 处理textNode
6. 挂载到body上