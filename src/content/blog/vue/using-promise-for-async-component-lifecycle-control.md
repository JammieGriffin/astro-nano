---
title: '使用 Promise 控制异步组件的生命周期'
description: ' '
tags:
  - vue
date: '2025-08-12'
draft: true
---

`defineAsyncComponent` 是 Vue3 中异步导入组件的 API。
常见的用法是与 [ES 模块动态导入](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import)
搭配使用。

通过 `defineAsyncComponent`，我们可以实现组件的按需加载、远程加载、懒加载等功能；在与 `import()` 动态导入搭配使用时，类似 Vite 和 Webpack 这类
构建工具在打包时会将动态导入的组件代码作为分割点分割成独立的 JS chunk，减少初始加载时的资源体积。


由于使用 `defineAsyncComponent` 导入的组件是异步加载的，组件的挂载时机会受到诸如网络延迟等因素的影响，因此，在通过 `ref` 引用调用异步组件实例暴露的方法时，我们需要
保证异步组件已经挂载，否则会遇到 `Cannot read properties of undefined` 错误。

那么该怎么去保证异步组件实例的方法被调用前组件已经加载？

核心思路是在父组件创建一个 `Promise` 去控制它，在异步组件挂载后兑现这个 `Promise`，在调用异步组件实例方法的代码前等待这个 `Promise` 被兑现再继续执行。

因此我们很自然地就想到，在异步组件的 `onMounted` 钩子函数中，使用 `emit` 发出一个事件，让父组件去监听这个事件并兑现 `Promise`。

```vue
<!--异步导入的组件-->
<template>
  <div>
  <!-- 组件模板 -->
  </div>
</template>
<script setup>
  const emit = defineEmits<{
    mounted: []
  }>()
  
  //  ... 组件逻辑
  
  onMounted(() => {
    emit('mounted')
  })
</script>

<!--父组件-->
<template>
  <div>
    <!-- 其它模板内容 -->
    <MyComponnet ref="asyncComponentRef" @mounted=""
  </div>
</template>
```
