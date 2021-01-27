> - **Redis官方文档**：https://redis.io/commands/sunion
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N) N 为全部集合的元素总数。

返回所有给定的一系列 set 的并集。

- key 不存在时被认为是个空的 set。

例子：

```typescript
await client.sadd('key1', 'a', 'b', 'c')
// 3
await client.sadd('key2', 'c', 'd', 'e')
// 3
await client.sunion('key1', 'key2')
// ["e", "b", "c", "a", "d"]
```
