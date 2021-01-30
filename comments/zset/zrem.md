> - **Redis官方文档**：https://redis.io/commands/zrem
> - **起始版本**：1.2.0
> - **时间复杂度**：O(M*log(N)) N 是排序集中的总元素数量，M 是需要移除的元素数量。

从排序集移除指定成员。不存在的成员会被忽略。

如果 key 存在但是对应的值不是排序集会返回错误。

### 返回值

返回从排序集中移除的成员数量，但是不包括不存在的成员。

**注意**：2.4 版本开始可以指定多个 member，更早的版本中每次命令调用只能移除一个 member。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2, three: 3 })
// 3
await client.zrem('zset', ['two'])
// 1
await client.zrange('zset', { min: 0, max: -1 }, true)
// ["one", "1", "three", "3"]
```
