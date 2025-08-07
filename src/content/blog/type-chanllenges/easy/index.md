---
title: "type-challenges 简单难度"
description: " "
tags: 
  - "typescript"
date: "2024-8-27"
---

## 实现 Pick

不使用 `Pick<T, K>` ，实现 TS 内置的 `Pick<T, K>` 的功能。

从类型 `T` 中选出符合 `K` 的属性，构造一个新的类型。

例如:

```typescript

interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
}

```

实现：

```typescript

type MyPick<T extends Object, K extends keyof T> = { [key in K]: T[key] }

```

## 对象属性只读

不要使用内置的 `Readonly<T>`，自己实现一个。

泛型 `Readonly<T>` 会接收一个
泛型参数，并返回一个完全一样的类型，只是所有属性都会是只读 (readonly) 的。

也就是不可以再对该对象的属性赋值。

例如：

```typescript

interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property

```

实现：

使用 `key in keyof T` 提取 `T` 的键并遍历，`key` 代表 `T` 的每一个键

```typescript

type MyReadonly<T> = { readonly [key in keyof T]: T[key] }

```

## 元组转换为对象

将一个元组类型转换为对象类型，这个对象类型的键/值和元组中的元素对应。

例如：

```typescript

const tuple = [ 'tesla', 'model 3', 'model X', 'model Y' ] as const

type result = TupleToObject<typeof tuple> // expected { 'tesla': 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}

```

实现：

使用 `T[number]` 遍历数组作为 `key`

```typescript

type TupleToObject<T extends readonly ( string | number | symbol )[]> = { [key in T[number]]: key } 

```

## 第一个元素

实现一个 `First<T>` 泛型，它接受一个数组T并返回它的第一个元素的类型。

例如：

```typescript

type arr1 = [ 'a', 'b', 'c' ]
type arr2 = [ 3, 2, 1 ]

type head1 = First<arr1> // 应推导出 'a'
type head2 = First<arr2> // 应推导出 3

```

实现：

```typescript

// 方法一：使用 infer 和 ... 提取出第一个元素和剩余元素

type First<T extends any[]> = T extends [ infer F, ...infer rest ] ? F : never

// 方法二： 使用 extends 判断 T 是否为空数组，如果不是返回 T[0]

type First<T extends any[]> = T extends [] ? never : T[0]

// 方法三： 使用 extends 判断 T['length'] 是否为 0，如果不是返回 T[0]

type First<T extends any[]> = T['length'] extends 0 ? never : T[0]

```

## 获取数组长度

创建一个 `Length` 泛型，这个泛型接受一个只读的元组，返回这个元组的长度。

例如：

```typescript

type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla> // expected 4
type spaceXLength = Length<spaceX> // expected 5

```

实现：

```typescript

type Length<T extends readonly any[]> = T['length']

```

## 实现 Exclude

实现内置的 `Exclude<T, U>` 类型，但不能直接使用它本身。

从联合类型 `T` 中排除 `U` 中的类型，来构造一个新的类型。

例如：

```typescript

type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'

```

实现：

对于联合类型 `T`, `T extends U` 会检查 `T` 的每一个成员是否可以赋值给 `U`

```typescript

type MyExclude<T,U> = T extends U ? never : T

```
