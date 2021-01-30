> - **Redis官方文档**：https://redis.io/commands/zrevrangebyscore
> - **起始版本**：2.2.0
> - **时间复杂度**：O(log(N)+M) N 为排序集中的成员数量，M 为需要移除的成员数量。
    > 如果 M 始终是个常量（比如使用 limit 限制始终返回前 10 个元素），此时可以认为复杂度为 O(log(N))。

返回排序集中介于 min 和 max 间的全部成员。跟 [[RedisSortedSetClient.zrangebyscore ｜ ZRANGEBYSCORE]] 命令不同的是，此命令行为默认从高到低排列。

具有相同分数的成员按照逆字典序排列。

**注意**：6.2.0 版本开始，[[RedisSortedSetClient.zrange | ZRANGE]] 可以通过参数 reverse 和 by:BYSCORE 来实现 ZREVRANGEBYLEX。在之后的版本中，ZREVRANGEBYLEX可能会被废弃。

### 返回值

数组形式返回指定范围内的成员。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2, three: 3 })
// 3
await client.zrevrangebyscore('zset', '+inf', '-inf')
// ["three", "two", "one"]
await client.zrevrangebyscore('zset', '2', '1')
// ["two", "one"]
await client.zrevrangebyscore('zset', '2', '(1')
// ["two"]
await client.zrevrangebyscore('zset', '(2', '(1')
// []
```
