> - **Redis官方文档**：https://redis.io/commands/sinter
> - **起始版本**：1.0.0
> - **时间复杂度**：最坏情况复杂度 O(N*M)，N 是最小集合元素个数，M 是集合个数。

返回所有给定 set 的交集。

- key 不存在时被认为是个空的 set，此时结果也是个空集。

例子：

```typescript
await client.sadd('key1', 'a', 'b', 'c')
// 3
await client.sadd('key2', 'c', 'd', 'e')
// 3
await client.sinter('key1', 'key2')
// ["c"]
```
