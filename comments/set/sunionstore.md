> - **Redis官方文档**：https://redis.io/commands/sunionstore
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N) N 是所有指定 set 包含的总元素数。

命令行为和 [[RedisSetClient.sunion | SUNION]] 一致，区别是 SUNIONSTORE 并不返回结果，而是将结果存入 destination，并返回结果集的元素个数。

- 如果 destination 已经存在，则会被覆盖。
- key 不存在时被认为是个空的 set。

例子：

```typescript
await client.sadd('key1', 'a', 'b', 'c')
// 3
await client.sadd('key2', 'c', 'd', 'e')
// 3
await client.sunionstore('key', ['key1', 'key2'])
// 5
await client.smembers('key')
// ["e", "b", "c", "a", "d"]
```
