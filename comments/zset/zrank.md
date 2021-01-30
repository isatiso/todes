> - **Redis官方文档**：https://redis.io/commands/zrank
> - **起始版本**：2.0.0
> - **时间复杂度**：O(log(N))

返回 member 在排序集中的顺位，排序规则为按照 score 从低到高。顺位是从 0 开始计数的，也就是说 0 表示第一顺位。

如果需要查询 score 从高到低的顺位可以使用 [[RedisSortedSetClient.zrevrank | ZREVRANK]] 命令。

### 返回值

- 如果 member 存在，则返回整型表示的顺位。
- 如果 member 不存在，返回 null。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2, three: 3 })
// 3
await client.zrank('zset', 'three')
// 2
await client.zrank('zset', 'four')
// null
```
