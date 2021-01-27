> - **Redis官方文档**：https://redis.io/commands/srandmember
> - **起始版本**：1.0.0
> - **时间复杂度**：不指定 count 参数时，复杂度为 O(1)，否则为 O(N) N 为 count。

随机的从 set 返回指定个数的 member。默认返回一个。

这个命令和 [[RedisSetClient.spop | SPOP]] 有些类似，区别是此命令只返回的元素，而不修改 set。

不同参数设定方式对应的行为：

- 不指定 count，随机返回一个元素，对于空 set 返回 null。
- count 为正数，随机返回 count 个不重复的元素。数组形式，元素不足时返回全部元素，可能为空数组。
- count 为负数，随机返回 |count| 个允许重复的元素。数组形式，结果和连续调用 n 次不带 count 参数的命令效果相同。

**注意**：2.6 版本开始支持 count 参数。更早的版本只会默认返回一个元素。

例子：

```typescript
await client.sadd('myset', 'one', 'two', 'three')
// 3
await client.srandmember('myset')
// "three"
await client.srandmember('myset', 5)
// ["two", "three", "one"]
await client.srandmember('myset', -5)
// ["three", "two", "two", "two", "three"]
await client.srandmember('myset', 0)
// []
```
