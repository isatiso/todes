> - **Redis官方文档**：https://redis.io/commands/sdiff
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N) N 是所有指定 set 包含的总元素数。

返回第一个 set 和后面连续的 set 做差集，一系列 member。

- key 不存在时被认为是个空的 set。

例子：

```typescript
await client.sadd('key1', 'a', 'b', 'c')
// 3
await client.sadd('key2', 'c', 'd', 'e')
// 3
await client.sdiff('key1', 'key2')
// ["a", "b"]
```
