> - **Redis官方文档**：https://redis.io/commands/psetex
> - **起始版本**：2.6.0
> - **时间复杂度**：O(1)

PSETEX 的行为和 [[RedisClient.setex | SETEX]] 一致。 唯一区别是到期时间是毫秒单位。

例子：

```typescript
await client.psetex('mykey', 'Hello', 1000)
// "OK"
await client.pttl('mykey')
// 961，不是固定值，取决于 执行 PTTL 和 PSETEX 的时间间隔。
await client.get('mykey')
// "Hello"
```
