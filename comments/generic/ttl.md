> - **Redis官方文档**：https://redis.io/commands/ttl
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

返回 key 的过期时间剩余秒数。这项自我检查的功能可以让 Redis 的客户端检查 key 作为数据库的一部分还有多长时间。

2.6 及更早的版本中，key 不存在或者未设置过期时间，都会返回 -1。 从 2.8 版本开始：

- 当 key 不存在时，返回 -2。
- 当 key 存在但是没有设置过期时间，返回 -1。

另请参阅 [[RedisGenericClient.pttl | PTTL]] 命令，他会返回毫秒级的相同信息。

### 返回值

以整数形式返回过期时间。 以及负数表示不同的过期时间状态。

例子：

```typescript
await client.set('mykey', 'Hello')
// "OK"
await client.expire('mykey', 10)
// 1
await client.ttl('mykey')
// 10
```

