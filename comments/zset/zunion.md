> - **Redis官方文档**：https://redis.io/commands/zunion
> - **起始版本**：6.2.0
> - **时间复杂度**：O(N)+O(M*log(M)) N 是全部输入集的大小的和，M 是结果集的大小。

这个命令类似 [[RedisSortedSetClient.zunionstore | ZUNIONSTORE]] 命令，区别是 ZUNION 不会存储结果，而是将结果返回到客户端。

具体参数选项的语义请参考 [[RedisSortedSetClient.zunionstore | ZUNIONSTORE]] 命令。

### 返回值

数组形式返回输入集的并集。
提供 withscores 参数会返回 member/score 对。

例子：

```typescript
await client.zadd('zset1', { one: 1, two: 2 })
// 2
await client.zadd('zset2', { one: 1, two: 2, three: 3 })
// 3
await client.zunion(['zset1', 'zset2'])
// ["one", "two", "three"]
await client.zunion(['zset1', 'zset2'], true)
// ["one", "2", "three", "3", "two", "4"]
```
