> - **Redis官方文档**：https://redis.io/commands/zcount
> - **起始版本**：2.0.0
> - **时间复杂度**：O(log(N)) N 是排序集中的成员数量。

返回排序集中 score 在 min 和 max 之间的成员数量。

min 和 max 的语义与 [[RedisSortedSetClient.zrangebyscore | ZRANGEBYSCORE]] 命令一致。

**注意**：此命令的复杂度仅为 O(log(N)) 是因为他查询的 member 是有序的。因此，查询无需遍历整个排序集。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2, three: 3 })
// 3
await client.zcount('zset', '-inf', '+inf')
// 3
await client.zcount('zset', '(1', '3')
// 2
```
