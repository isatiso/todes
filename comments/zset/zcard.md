> - **Redis官方文档**：https://redis.io/commands/zcard
> - **起始版本**：1.2.0
> - **时间复杂度**：O(1)

返回排序集的成员总数量。当 key 不存在时返回 0。

例子：

```typescript
await client.zadd('zset', { one: 1, two: 2, three: 3, four: 4 })
// 4
await client.zcard('zset')
// 4
```
