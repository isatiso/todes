> - **Redis官方文档**：https://redis.io/commands/zscore
> - **起始版本**：1.2.0
> - **时间复杂度**：O(1)

返回排序集中指定成员的分数。
如果 key 不存在或者 member 不存在，返回 null。

### 返回值

返回字符串形式的双精度浮点数。

例子：

```typescript
await client.zadd('zset', { one: 1 })
// 1
await client.zscore('zset', 'one')
// "1"
```
