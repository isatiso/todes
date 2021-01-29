> - **Redis官方文档**：https://redis.io/commands/zrangebyscore
> - **起始版本**：1.0.5
> - **时间复杂度**：O(log(N)+M) N 是排序集中的成员数量，M 是需要返回的成员数量。
    > 如果 M 始终是个常量（比如使用 limit 限制始终返回前 10 个元素），此时可以认为复杂度为 O(log(N))。

返回排序集中 score 在 min 和 max 之间的一系列 member。当设置了 withscores 参数时，返回一系列 member/score 对。
返回元素默认按照分数从小到大排列。

具有相同分数的成员按照字典序排列（这来自于 Redis 排序集的一个默认行为，不涉及进一步计算）。

在 Redis 6.2.0 版本，这个命令可能被废弃。请在新代码中使用带 BYSCORE 参数的 [[RedisSortedSetClient.zrange | ZRANGE]] 命令。

可选参数 limit 可以用来限制返回成员数量（类似 SQL 中的 SELECT LIMIT offset, count）。负数的 count 表示返回 offset 后的全部元素。
需要注意的是，如果 offset 很大，排序集在找到需要返回的元素前要先遍历 offset 个元素。这可能会增加 O(N) 的复杂度。

可选参数 withscores 表示让命令返回 member/score 对，而不是只返回 member 本身。这个选项在 2.0 版本开始可用。

### 开区间和无穷大

min 和 max 可以使用值 `'-inf'` 和 `+inf` 分别表示排序集中的最小值和最大值。
默认指定的 min 和 max 是被包含在选择范围内的（闭区间）。
通过添加前缀 `'('` 可以表示排除 min 或者 max 本身（开区间）。
如：`(1 5 表示 1 < score <= 5`，`(5 (10 表示 5 < score < 10`。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2, three: 3 })
// 3
await client.zrangebyscore('zset', '-inf', '+inf')
// ["one", "two", "three"]
await client.zrangebyscore('zset', '1', '2')
// ["one", "two"]
await client.zrangebyscore('zset', '(1', '2')
// ["two"]
await client.zrangebyscore('zset', '(1', '(2')
// []
```
