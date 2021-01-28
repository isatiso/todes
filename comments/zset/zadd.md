> - **Redis官方文档**：https://redis.io/commands/zadd
> - **起始版本**：1.2.0
> - **时间复杂度**：每添加一个 item 的复杂度是 O(log(N))，N 是 zset 包含的元素
>
> **zset** 和 **排序集** 表示 Sorted Set。
> **成员** 和 **member** 表示排序集内的元素。
> **score** 和 **分数** 表示排序集内元素对应的分数。

将指定的 score/member 对添加到 key 对应的 zset 中。可以指定多个 score/member 对。
如果指定的 member 已经存在于 zset 中，则将更新 score 并在正确的位置重新插入 member，以确保顺序正确。

- 如果 key 不存在，则会创建一个以指定 member 为唯一 member 的新 zset，就像该 zset 为空一样。
- 如果 key 存在对应的值不是 zset，则返回错误。
- score 值应为双精度浮点数的字符串表示形式。`+inf` 和 `-inf` 也是有效值。

### 可以精确表示的整数分数范围

Redis zset 使用 **IEEE 754  64 位双精度浮点数** 表示 score。
它能表示的整数范围是 [-(2^53), +(2^53)]。确切的说就是 [-9007199254740992, 9007199254740992]。
较大的整数或小数在内部以指数形式表示，因此只能获得十进制数字的近似值。

### 排序集

Redis zset 以 score 正序进行存储。相同的 member 只能存在一次，不允许出现重复的 member。
score 可以通过 ZADD 命令进行修改，它会更新 score，同时更新对应的 member 在排序集中的位置。

### 分数相同的 member

虽然排序集中 member 不可以重复，但是不同的 member 可以对应相同的 score。
当多个 member 对应相同的 score 时，它们会按照 *字典序* 进行排列。
字典序的意思是将字符串看作一个二进制数组，从头进行比较。
如果用户向一个排序集中以相同的分数（比如 0）插入所有 member，则这个排序集中的所有 member 按照字典序排列。
此时范围查询可以使用 [[RedisSortedSetClient.zrangebylex | ZRANGEBYLEX]] 命令。

### 返回值

- 不使用 `incr_mode` 的时候，返回整数，表示被添加的 member 数量。此时使用 CH 选项，则返回值表示被修改的 member 数量。
- 使用 `incr_mode=true` 则会将命令行为变为自增模式，此时只能接受一对 score/member，并返回修改后的 score。
  - 当同时传递了 `update_if_member: 'NX' | 'XX'` 的时候，如果命令被终止则会返回 null。
  - **注意**：6.2 版本新添加的 `update_if_score: 'LT' | 'GT'` 选项（对应 Redis 命令的 LT｜GT 选项）行为有些特殊。
    这个选项在不符合条件时会阻止修改 score。但是依然会返回修改后的 score。
    比如：
    对于排序集 `zset { a: '12' }`，
    对 member a 执行自增操作，但是仅相当新结果小于旧结果时进行修改，
    `await client.zadd('zset', {a: '1'}, true, { update_if_score: 'LT' })` 。
    此时返回 `'13'`，即执行了自增之后的结果，但实际上排序集的状态为 `zset { a: '12' }`，也就是没被修改。

例子：

```typescript
await client.sadd('myset', 'Hello')
// 1
await client.sadd('myset', 'World')
// 1
await client.sadd('myset', 'World')
// 0
await client.smembers('myset')
// ["World", "Hello"]
```
