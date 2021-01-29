> - **Redis官方文档**：https://redis.io/commands/zdiff
> - **起始版本**：6.2.0
> - **时间复杂度**：最坏情况复杂度为 O(L+(N-K)log(N))，L 是全部排序集中的成员数量，N 是第一个排序集的成员数量，K 是结果集的大小。

这个命令类似 [[RedisSortedSetClient.zdiffstore | ZDIFFSTORE]]，区别是 ZDIFF 不会存储结果，而是将结果返回到客户端。

例子：

```typescript
await client.zadd('zset1', { one: 1, two: 2, three: 3 })
// 3
await client.zadd('zset2', { one: 1, two: 2 })
// 2
await client.zdiff(['zset1', 'zset2'])
// ["three"]
await client.zdiff(['zset1', 'zset2'], true)
// ["three", "3"]
```
