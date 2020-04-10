# promise-extends

## 介绍
promise-extends是基于Promise现有方法的一个扩展库。

##安装

```
npm i promise-extends
```

## 快速上手

### 初始化

```
import {PromiseExtends} from 'promise-extends

PromiseExtends.extend([options])
```
options:可配置项

```
{
   isExtend: boolean // 默认是true
} 
```

### 使用

#### Promise.limit：限流。


```
Promise.limit([fn1(), fn2(), fn3()], {limitNumber: 2})
```

#### Promise.allow：执行的函数数组中，允许某几个执行失败。

```
Promise.allow([fn1(), fn2(), fn3(), fn4(), fn5()], [1, 3])
```
如果不指定某几个，则会认为只要有一个执行成功，就会返回；

返回时的数据结构为：

```
[
  {isDone: boolean //是否成功， data: any // 返回的数据，包括成功或者失败的数据 }
]
```

#### Promise.shake: 防抖动


```
const fn = Promise.shake(fn);

fn().then(d => d).catch(e => throw e)
```
调用多次fn，最终也只会执行第一此调用的fn返回的promise。


#### Promise.prototype.done

```
const fn = () => {
    return new Promise((res, rej) => rej());
}

fn().then().done(success, fail)
```
