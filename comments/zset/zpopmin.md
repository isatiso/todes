> - **Redis官方文档**：https://redis.io/commands/zpopmin
> - **起始版本**：5.0.0
> - **时间复杂度**：O(log(N) * M) N 是排序集的元素个数，M 是弹出的元素个数。

移除并返回排序集中 score 排名后 count 个 member/score。

- 如果不指定 count，则默认 count 为 1。
- 如果指定的 count 比排序集的 member 个数还多，会弹出全部元素，而不是返回错误。
- 返回的 member 按照分数从低到高排序。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2, three: 3, four: 4 })
// 4
await client.zpopmin('zset', 2)
// ["one", "1", "two", "2"]
await client.zpopmin('zset')
// ["three", "3"]
```
