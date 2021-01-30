> - **Redis官方文档**：https://redis.io/commands/zrevrange
> - **起始版本**：1.2.0
> - **时间复杂度**：O(log(N)+M) N 为排序集中的成员数量，M 为需要移除的成员数量。

返回排序集中指定范围的成员。调用此命令时可以认为成员排序是按照分数从高到低的。
相同分数的成员按照逆字典序排列。

除了顺序是颠倒的以外，ZREVRANGE 和 [[RedisSortedSetClient.zrange | ZRANGE]] 命令行为一样。

**注意**：6.2.0 版本开始，[[RedisSortedSetClient.zrange | ZRANGE]] 可以用来实现此命令的行为，可能在之后的版本中被废弃。

### 返回值

数组形式返回指定范围的一系列成员。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2, three: 3 })
// 3
await client.zrevrange('zset', 0, -1)
// ["three", "two", "one"]
await client.zrevrange('zset', 2, 3)
// ["one"]
await client.zrevrange('zset', -2, -1)
// ["two", "one"]
```
