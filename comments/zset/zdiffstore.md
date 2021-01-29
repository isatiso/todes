> - **Redis官方文档**：https://redis.io/commands/zdiffstore
> - **起始版本**：6.2.0
> - **时间复杂度**：最坏情况复杂度为 O(L+(N-K)log(N))，L 是全部排序集中的成员数量，N 是第一个排序集的成员数量，K 是结果集的大小。

计算第一个排序集和随后的其他排序集的差集，并将结果存入 destination。
不存在的 key 被认为是个空集。
如果 destination 已经存在则会被重写。

例子：

```typescript
await client.zadd('zset1', { one: 1, two: 2, three: 3 })
// 3
await client.zadd('zset2', { one: 1, two: 2 })
// 2
await client.zdiffstore('out', ['zset1', 'zset2'])
// 1
await client.zrange('out', { by: 'BYSCORE', min: '-inf', max: '+inf' }, true)
// ["three", "3"]
```
