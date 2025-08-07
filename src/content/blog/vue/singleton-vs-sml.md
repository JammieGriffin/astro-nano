---
title: 单例状态管理 VS 状态管理库
description: ' '
tags:
  - vue
date: 2025-03-27
---

## 模块单例实现状态管理

在 Vue3 中，对于一部分需要在多个组件之间共享的响应式状态，我们可以在 `js/ts` 文件中使用 Vue 的响应式 API
创建并导出它们，并将这些状态导入到组件中实现状态共享。

官方文档：[用响应式 API 做简单状态管理](https://cn.vuejs.org/guide/scaling-up/state-management#simple-state-management-with-reactivity-api)

```ts
// state.ts
import { ref } from 'vue'

export const count = ref(0)
```

```vue
<!--ExampleA.vue-->
<template>
  <div>
    <h3>这里是 exampleA 组件</h3>
    <p>exampleA 组件中 count 值：{{count}}</p>
    <el-button @click="count++">count ++</el-button>
  </div>
</template>
<script setup lang="ts">
  import { count } from './state'
</script>
```

```vue
<!--ExampleB.vue-->
<template>
  <div>
    <h3>这里是 exampleB 组件</h3>
    <p> exampleB 中 count 值：{{count}}</p>
  </div>
</template>
<script setup lang="ts">
  import { count } from './state'
</script>

```

### 原理

通过 ES Module 的静态解析特性，`state.ts` 文件在首次导入时会被初始化一次，导出的 ref 会成为单例对象。所有组件导入的都是同一个内存引用。

#### 一、ES Module 的静态解析特性

当首次通过 `import` 导入一个模块时，模块代码会 执行一次，生成导出的变量。

后续所有 `import` 该模块的地方，都会直接 复用第一次初始化的结果，不会再执行模块代码。

模块导出的变量本质是一个 **`JavaScript` 对象的内存地址**。

所有导入该模块的地方，实际是获取**同一个内存地址的引用**。

#### 二、模块缓存机制

##### Node.js 的模块缓存

在 Node.js 中，模块系统维护一个 `require.cache` 对象，缓存已加载的模块。

以模块的 **完整文件路径** 作为缓存键，确保同一路径的模块只加载一次。

##### 浏览器中的 `ESM` 行为

现代浏览器原生支持 ES Module，其模块缓存逻辑与 Node.js 类似。

通过 `<script type="module">` 加载的模块，相同 URL 的模块只会执行一次。

### 优点

- ✔ 利用 JavaScript 模块的天然单例特性实现，无需额外依赖。

### 缺点

- ❌ 状态直接暴露，任何模块都可以直接修改，难以跟踪变化。
- ❌ 无法在 SSR 中安全使用（[单例污染问题](https://cn.vuejs.org/guide/scaling-up/ssr.html#cross-request-state-pollution)）
- ❌ 状态在模块初始化时创建，无法延迟初始化
- ❌ 需要手动清理副作用
- ❌ 缺乏结构化设计（如缺失统一的状态更新逻辑）

### `createGlobalState` (vueuse)

`createGlobalState` 是 vueuse 提供的一个工具函数，通过 Vue 的 `effectScope` API 实现跨组件、实例共享
对于中大型项目，尤其是涉及服务端渲染、状态复用或复杂逻辑时，`createGlobalState` 提供了更安全、更健壮的解决方案。

## 对比总结

| 特性    | 模块化单例  | createGlobalState | Pinia                                  |
|-------|--------|-------------------|----------------------------------------|
| 响应式管理 | 手动     | 自动                | 自动                                     |
| 状态结构  | 简单对象   | 组合式 API 风格        | 选项式（state/actions/getters）& 组合式 API 风格 |
| 调试工具  | 无      | 无                 | 支持时间旅行调试                               |
| 适用场景  | 简单全局状态 | 跨组件共享状态           | 复杂状态管理                                 |

### 如何选择？

- 简单场景：使用模块化单例或 `createGlobalState`。
- 需要响应式和轻量级：使用 `createGlobalState`。
- 需要完整状态管理功能：使用 Pinia。


