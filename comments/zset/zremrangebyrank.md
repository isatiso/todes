> - **Redis官方文档**：https://redis.io/commands/zremrangebyrank
> - **起始版本**：2.0.0
> - **时间复杂度**：O(log(N)+M) N 为排序集中的成员数量，M 为需要移除的成员数量。

从排序集中移除顺位在 start 和 stop 中间的全部成员。

start 和 stop 都是从 0 开始计数的从低到高的顺位。start 和 stop 可以是负数，表示从高到低的顺位。-1 表示倒数第一个元素，-2 表示倒数第二个元素，以此类推。

### 返回值

返回被移除的元素个数。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2, three: 3 })
// 3
await client.zremrangebyrank('zset', 0, 1)
// 2
await client.zrange('zset', { min: 0, max: -1 }, true)
// ["three", "3"]
```
