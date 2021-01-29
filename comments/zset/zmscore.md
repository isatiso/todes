> - **Redis官方文档**：https://redis.io/commands/zmscore
> - **起始版本**：6.2.0
> - **时间复杂度**：O(N) N 是请求的成员数量。

以数组形式返回指定的一系列 member 对应的 score。
对于每个不存在的 member 返回 null。

例子：

```typescript
await client.zadd('myzset', { one: 1 })
// 1
await client.zadd('myzset', { two: 2 })
// 1
await client.zmscore('myzset', ['one', 'two', 'nofield'])
// ["1", "2", null]
```
