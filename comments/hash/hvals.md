> - **Redis官方文档**：https://redis.io/commands/hvals
> - **起始版本**：2.0.0
> - **时间复杂度**：O(N) N 是 hash 的大小。

以数组形式返回指定 hash 中全部的值。当 key 不存在时返回空数组。

例子：

```typescript
await client.hset('myhash', { f1: 'Hello' })
// 1
await client.hset('myhash', { f2: 'World' })
// 1
await client.hvals('myhash')
// ["Hello", "World"]
```
