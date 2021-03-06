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

## 添加state和视图更新方法
1. 添加数据来源，并将办法更新视图
2. 使用root已经不能很好支持节点更新，所以用range将节点放进对应位置
3. rerender => _renderToDOM => _renderToDOM(递归)
4. 对attribute中的onClick添加特殊处理

## setState的实现和demo完成
1. 编写setState方法，进行merge和rerender
2. 复制重现demo
3. 处理className属性和child为null的情况
4. 处理range自带的bug（自己电脑上没发现。这步虽然繁琐，但无需特别在意。）

## 生成vdom对象并完成第一渲染
1. get vdom方法，返回几个关键信息（type，props， children）
2. 让ElementWrapper继承Component公用setAttribute和appendChild
3. 因为必须有方法才能完成渲染，所以 get vdom 返回改成this
4. 在ElementWrapper中完成setAttribute和appendChild的操作
5. 主要差异体现在每个类的实例this上都有了关键属性，原本：拿到值直接生成节点->塞属性->先删除后添加
6. 变成了：将各个属性在this上先做保留，只在_renderToDOM中设置属性->先删除后添加

## 添加简单diff算法有效更新dom
1. 关键方法update，先判断节点是否一致（type,props,props长度，content）
2. 比较较为粗浅，其实可以props之类的可以通过patch更省性能实现
3. children对比只使用index对应来循环调用update方法（会产生递归）
4. 处理newChildren较多的情况，尾部添加
5. 封装通用的解决range bug 的方法
6. *其中事件本不应该作为props，会导致大量增删，但先不展开





