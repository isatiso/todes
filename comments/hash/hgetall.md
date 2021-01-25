> - **Redis官方文档**：https://redis.io/commands/hgetall
> - **起始版本**：2.0.0
> - **时间复杂度**：O(N) N 是 hash 的大小。

以 object 形式返回 hash 中的全部 field 和值。

例子：

```typescript
await client.hset('myhash', { field1: 'foo' })
// 1
await client.hget('myhash', 'field1')
// "foo"
await client.hget('myhash', 'field2')
// null
await client.hget('nonexists', 'field2')
// null
```
