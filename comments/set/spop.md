> - **Redis官方文档**：https://redis.io/commands/spop
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

随机的从指定 set 移除并返回指定个数的 member。默认返回一个。

这个命令和 [[RedisSetClient.srandmember | SRANDMEMBER]] 有些类似，区别是此命令会同时移除返回的元素。

- 不指定 count 时返回单个元素，或者 null。
- 指定 count 时以数组形式返回结果，如果集合中的元素不足，则返回集合全部元素，最小为空数组。

**注意**：3.2 版本开始支持 count 参数。更早的版本只会默认返回一个元素。

例子：

```typescript
await client.sadd('myset', 'one', 'two', 'three')
// 3
await client.spop('myset')
// "one"
await client.smembers('myset')
// ["three", "two"]
await client.sadd('myset', 'four', 'five')
// 2
await client.spop('myset', 3)
// ["five", "three", "two"]
await client.smembers('myset')
// ["four"]
```
