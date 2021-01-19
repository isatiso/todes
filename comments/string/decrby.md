> - **Redis官方文档**：https://redis.io/commands/decrby
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

将 key 处存储的数字减少 delta，并返回处理之后的结果。

详情参考 [[RedisClient.incr | INCR]]。

例子：

```typescript
await client.set('mykey', '10')
// "OK"
await client.decrby('mykey', 3)
// 7
```
