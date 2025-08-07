---
title: "type-challenges 中等难度"
description: " "
tags: 
  - "typescript"
date: "2024-09-10"
---

## 获取函数返回类型

不使用 `ReturnType` 实现 TypeScript 的 `ReturnType<T>` 泛型。

例如：

```ts
const fn = (v: boolean) => {
  if (v)
    return 1
  else
    return 2
}

type a = MyReturnType<typeof fn> // 应推导出 "1 | 2"
```

实现：

1. 使用 `extends` 约束泛型参数为任意函数: `MyReturnType<T extends (...args: any) => any>`
2. 使用 `extends` 判断泛型参数 `T` 是否为函数，并使用 `infer` 推导出函数的返回类型

```ts
type AnyFn<T = any> = (...args: any) => T
type MyReturnType<T extends AnyFn> = T extends AnyFn<infer R> ? R : never
```


