> - **Redis官方文档**：https://redis.io/commands/zlexcount
> - **起始版本**：2.8.9
> - **时间复杂度**：O(log(N)) N 是排序集中成员数量。

当排序集中的全部元素使用相同的分数存储时，成员按照字典序排列，此时此命令可以用来返回字典序在 min 和 max 之间的成员。

**min** 和 **max** 参数的详细语义参考 [[RedisSortedSetClient.zrangebylex | ZRANGEBYLEX]] 命令。

例子：

```typescript
await client.zadd('zset', { a: 0, b: 0, c: 0, d: 0, e: 0 })
// 5
await client.zadd('zset', { f: 0, g: 0 })
// 2
await client.zlexcount('zset', '-', '+')
// 7
await client.zlexcount('zset', '[b', '[f')
// 5
```
