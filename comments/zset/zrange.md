> - **Redis官方文档**：https://redis.io/commands/zrange
> - **起始版本**：1.2.0
> - **时间复杂度**：O(log(N)+M) N 是排序集中的成员个数，M 是结果元素成员。

返回指定范围的成员，通过指定 range 参数中的 by 选项，可以让命令实施不同的行为。默认按照索引排序选取。

6.2.0 版本开始，ZRANGE 可以替代 [[RedisSortedSetClient.zrevrange | ZREVRANGE]]、[[RedisSortedSetClient.zrangebyscore | ZRANGEBYSCORE]]、[[RedisSortedSetClient.zrevrangebyscore | ZREVRANGEBYSCORE]]、[[RedisSortedSetClient.zrangebylex | ZRANGEBYLEX]]、[[RedisSortedSetClient.zrevrangebylex | ZREVRANGEBYLEX]] 五个命令。

### 公共行为和选项

成员的排列顺序为从低到高。分数相同的成员按照字典序排列。

- **reverse** 参数将排序方式改为从高到低，包括字典序。
- **limit** 参数可以限定返回值得范围（类似 SQL 中的 LIMIT offset, count）。负数的 count 表示获取跳过 offset 个元素后的全部元素。
- **withscores** 参数表示让命令返回 member/score 对，而不是只返回 member 本身。

### 索引范围选择

ZRANGE 默认按照索引排序进行范围选取。min 和 max 参数是从 0 开始的索引计数，0 表示第一个元素，1 表示第二个元素，以此类推。
这些参数指定了一个闭区间，比如：`{min: 0, max: 1}` 表示的范围就是排序集的第一个和第二个元素。

索引可以是负数，表示到排序集末尾的距离，-1 表示最后一个元素，-2 表示倒数第二个元素，以此类推。

超出实际范围的索引会导致返回错误。

如果 min 比 max 大或者比 end 对应的索引大，会返回一个空列表。
如果 max 比 end 对应的索引大，Redis 会认为这个 max 指定了最后一个元素。

### 分数范围选择

当 range 参数中设置了 BYSCORE，命令行为会和 [[RedisSortedSetClient.zrangebyscore | ZRANGEBYSCORE]] 命令一致，返回分数介于 min 和 max 之间的成员。

**min** 和 **max** 可以使用值，`'-inf'` 和 `'+inf'`，分别表示负无穷大和正无穷大。这意味着你不需要知道实际的最大分数或最小分数，也能选取全部的成员。

通过 min 和 max 指定的区间范围默认是闭区间，也就是包含 min 和 max 本身。可以通过在分数前缀 `(` 表示排除 min 或者 max。

### 字典序范围选择

当 range 参数中设置了 BYLEX，命令行为会和 [[RedisSortedSetClient.zrangebylex | ZRANGEBYLEX]] 命令一致，按照字典序返回介于 min 和 max 之间的元素。

**注意**：字典序范围选取依赖 **排序集中的成员分数全部一致**，在分数不一致的情况下，选取行为是未定义的。

在字典序模式下，min 和 max 必须以 `(`（不包含本身） 或 `[`（包含本身）开头。

min 和 max 可以使用特殊值 `-` 和 `+` 分别表示无穷小的字符串和无穷大的字符串。

**字典序**：member 名称（字符串）被认为是一个 byte array，通过逐位比较大小确定排序。这和字符串的字符集有关。


例子：

```typescript
await client.zadd('myzset', { one: 1, two: 2, three: 3 })
// 3
await client.zrange('myzset', { min: 0, max: -1 })
// ["one", "two", "three"]
await client.zrange('myzset', { min: 2, max: 3 })
// ["three"]
await client.zrange('myzset', { min: -2, max: -1 })
// ["two", "three"]
await client.zrange('myzset', { min: 0, max: 1 }, true)
// ["one", "1", "two", "2"]
await client.zrange('myzset', { by: 'BYSCORE', min: '(1', max: '+inf' }, { limit: [1, 1] })
// ["three"]
```
