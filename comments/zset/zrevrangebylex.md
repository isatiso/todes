> - **Redis官方文档**：https://redis.io/commands/zrevrangebylex
> - **起始版本**：2.8.9
> - **时间复杂度**：O(log(N)+M) N 为排序集中的成员数量，M 为需要移除的成员数量。
    > 如果 M 始终是个常量（比如使用 limit 限制始终返回前 10 个元素），此时可以认为复杂度为 O(log(N))。

有时为了获取一个字典序排序的排序集，会将所有成员以相同的分数存入排序集中，此时可以用 ZREVRANGEBYLEX 返回按照逆字典序排列在 min 和 max 中间的成员。

除了倒序排列，ZREVRANGEBYLEX 和 [[RedisSortedSetClient.zrangebylex | ZRANGEBYLEX]] 命令行为一致。

**注意**：6.2.0 版本开始，[[RedisSortedSetClient.zrange | ZRANGE]] 可以通过参数 reverse 和 by:BYLEX 来实现 ZREVRANGEBYLEX。在之后的版本中，ZREVRANGEBYLEX可能会被废弃。

### 返回值

数组形式返回指定范围内的成员。

例子：

```typescript
await client.zadd('zset', { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 })
// 7
await client.zrevrangebylex('zset', '[c', '-')
// ["c", "b", "a"]
await client.zrevrangebylex('zset', '(c', '-')
// ["b", "a"]
await client.zrevrangebylex('zset', '(g', '[aaa')
// ["f", "e", "d", "c", "b"]
```
