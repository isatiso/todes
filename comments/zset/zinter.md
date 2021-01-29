> - **Redis官方文档**：https://redis.io/commands/zinter
> - **起始版本**：6.2.0
> - **时间复杂度**：最坏情况复杂度为 O(N*K)+O(M*log(M)) N 是最小排序集，K 是排序集数量，M 是结果集大小。

此命令和 [[RedisSortedSetClient.zinterstore | ZINTERSTORE]] 命令，区别是 ZINTER 不会存储结果，而是将结果返回到客户端。

具体参数选项的语义请参考 [[RedisSortedSetClient.zinterstore | ZINTERSTORE]] 命令。

例子：

```typescript
await client.zadd('zset1', { one: 1, two: 2 })
// 2
await client.zadd('zset2', { one: 1, two: 2, three: 3 })
// 3
await client.zinter(['zset1', 'zset2'])
// ["one", "two"]
await client.zinter(['zset1', 'zset2'], true)
// ["one", "2", "two", "4"]
```
