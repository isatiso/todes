> - **Redis官方文档**：https://redis.io/commands/zrangestore
> - **起始版本**：6.2.0
> - **时间复杂度**：O(log(N)+M) N 是排序集中的成员数量，M 是结果集成员数量。

这个命令类似 [[RedisSortedSetClient.zrange | ZRANGE]] 命令，区别是 ZRANGESTORE 会将结果存入 destination。

返回结果集成员数量。

例子：

```typescript
await client.zadd('srczset', { one: 1, two: 2, three: 3, four: 4 })
// 4
await client.zrangestore('dstzset', 'srczset', { min: 2, max: -1 })
// 2
await client.zrange('dstzset', { min: 0, max: -1 })
// ["three", "four"]
```
