> - **Redis官方文档**：https://redis.io/commands/pexpireat
> - **起始版本**：2.6.0
> - **时间复杂度**：O(1)


效果和 [[RedisClient.expireat | EXPIREAT]] 一样，区别是 PEXPIREAT 的到期时间戳是毫秒单位的。

返回值含义：
- `1` ttl 设置成功。
- `0` key 不存在，设置失败。

例子：

```typescript
await client.set('mykey', 'Hello')
// "OK"
await client.pexpireat('mykey', 1555555555005)
// 1
await client.ttl('mykey')
// -2
await client.pttl('mykey')
// -2
```

