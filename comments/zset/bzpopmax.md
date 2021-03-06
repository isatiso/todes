> - **Redis官方文档**：https://redis.io/commands/bzpopmax
> - **起始版本**：5.0.0
> - **时间复杂度**：O(log(N)) N 是排序集的元素个数

BZPOPMAX 是阻塞版本的 [[RedisSortedSetClient.zpopmax | ZPOPMAX]] 命令。
当指定的排序集中没有可弹出元素时会阻塞连接，直到有其他客户端向排序集中插入元素，或者超时。

- 没有元素可弹出且超时，返回 null。
- 指定的排序集中有可以弹出的元素时，返回形如 key，member，score 的三元组。

更准确的语义请参考 [[RedisListClient.blpop | BLPOP]] 命令。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2, three: 3, four: 4 })
// 4
await client.bzpopmax(['zset', 'zset1'], 0)
// ["zset", "four", "4"]
```
