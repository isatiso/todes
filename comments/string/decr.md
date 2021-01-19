> - **Redis官方文档**：https://redis.io/commands/decr
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

将 key 处存储的数字减 1，并返回处理之后的结果。

详情参考 [[RedisClient.incr | INCR]]。

例子：

```typescript
await client.set('mykey', '10')
// "OK"
await client.decr('mykey')
// 9
await client.set('mykey', '234293482390480948029348230948')
// "OK"
await client.decr('mykey')
// ReplyError: ERR value is not an integer or out of range
```
