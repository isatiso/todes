> - **Redis官方文档**：https://redis.io/commands/pexpire
> - **起始版本**：2.6.0
> - **时间复杂度**：O(1)

效果和 [[RedisClient.expire | EXPIRE]] 一样，区别是 PEXPIRE 的 ttl 是毫秒单位。

返回值含义：
- `1` ttl 设置成功。
- `0` key 不存在，设置失败。

例子：

```typescript
await client.set('mykey', 'Hello')
// "OK"
await client.pexpire('mykey', 1500)
// 1
await client.ttl('mykey')
// 1
await client.pttl('mykey')
// 1411
```

