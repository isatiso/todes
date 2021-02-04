> - **Redis官方文档**：https://redis.io/commands/pttl
> - **起始版本**：2.6.0
> - **时间复杂度**：O(1)

像 [[RedisGenericClient.ttl | TTL]] 命令一样，返回剩余有效时间。唯一区别是，PTTL 使用毫秒级时间戳。

2.6 及更早的版本中，key 不存在或者未设置过期时间，都会返回 -1。
从 2.8 版本开始：
- 当 key 不存在时，返回 -2。
- 当 key 存在但是没有设置过期时间，返回 -1。

例子：

```typescript
await client.set('mykey', 'Hello')
// "OK"
await client.expire('mykey', 1)
// 1
await client.pttl('mykey')
// 957
```

