> - **Redis官方文档**：https://redis.io/commands/zincrby
> - **起始版本**：1.2.0
> - **时间复杂度**：O(log(N)) N 是排序集的成员数量。

将指定 member 的 score 进行自增操作。
如果 member 不存在，就将自增值直接存到 member（就像它之前的值是 0.0）。
如果 key 不存在，则创建一个只含有 member 的排序集。

如果 key 存在但是值不是排序集则会返回错误。

score 需要是字符串形式的数字，可以接受双精度浮点数。可以通过指定一个负数的 score 来进行自减操作。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2 })
// 2
await client.zincrby('zset', '2', 'one')
// "3"
await client.zrange('zset', { min: 0, max: -1 }, true)
// ["two", "2", "three", "3"]
```
