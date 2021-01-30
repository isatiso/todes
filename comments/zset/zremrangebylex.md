> - **Redis官方文档**：https://redis.io/commands/zremrangebylex
> - **起始版本**：2.8.9
> - **时间复杂度**：O(log(N)+M) N 为排序集中的成员数量，M 为需要移除的成员数量。

当排序集中的全部成员含有相同的 score 时，成员按照字典序排列，ZREMRANGEBYLEX 可以在这种情况下移除 min 和 max 之间的所有成员。

此命令中的 min 和 max 的语义和 [[RedisSortedSetClient.zrangebylex | ZRANGEBYLEX]] 命令相同。

例子：

```typescript
await client.zadd('zset', { aaaa: 0, b: 0, c: 0, d: 0, e: 0 })
// 5
await client.zadd('zset', { foo: 0, zap: 0, zip: 0, ALPHA: 0, alpha: 0 })
// 5
await client.zrange('zset', { min: 0, max: -1 })
// ["ALPHA", "aaaa", "alpha", "b", "c", "d", "e", "foo", "zap", "zip"]
await client.zremrangebylex('zset', '[alpha', '[omega')
// 6
await client.zrange('zset', { min: 0, max: -1 })
// ["ALPHA", "aaaa", "alpha", "b", "c", "d", "e", "foo", "zap", "zip"]
```
