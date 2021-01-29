> - **Redis官方文档**：https://redis.io/commands/zinterstore
> - **起始版本**：2.0.0
> - **时间复杂度**：最坏情况复杂度为 O(N*K)+O(M*log(M)) N 是最小排序集，K 是排序集数量，M 是结果集大小。

计算给定一系列的排序集的交集，并将结果存储到 destination 中。如果 destination 已经存在则会被重写。

默认结果集中的 score 是该成员在所有集合中对应的 score 的和。

**aggregate** 和 **weights** 参数的说明见 [[RedisSortedSetClient.zunionstore | ZUNIONSTORE]] 命令。

例子：

```typescript
await client.zadd('zset1', { one: 1, two: 2 })
// 2
await client.zadd('zset2', { one: 1, two: 2, three: 3 })
// 3
await client.zinterstore('out', ['zset1', 'zset2'], { weights: [2, 3] })
// 2
await client.zrange('out', { min: 0, max: -1 }, true)
// ["one", "5", "two", "10"]
```
