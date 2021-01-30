> - **Redis官方文档**：https://redis.io/commands/zremrangebyscore
> - **起始版本**：1.2.0
> - **时间复杂度**：O(log(N)+M) N 为排序集中的成员数量，M 为需要移除的成员数量。

从排序集中移除顺位在 min 和 max 中间，包括 min 和 max 的全部成员。

**注意**：2.1.6 版本之后 min 和 max 可以被排除在选取范围外。具体语法见 [[RedisSortedSetClient.zrangebyscore | ZRANGEBYSCORE]] 命令。

### 返回值

返回被移除的元素个数。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2, three: 3 })
// 3
await client.zremrangebyscore('zset', '-inf', '(2')
// 1
await client.zrange('zset', { min: 0, max: -1 }, true)
// ["two", "2", "three", "3"]
```
