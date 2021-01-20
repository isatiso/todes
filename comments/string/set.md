> - **Redis官方文档**：https://redis.io/commands/set
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

设置 key 的值为一个 string。

- 如果 key 已经存在，则值会被覆盖。
- 如果没有设置 ttl 相关选项，当命令成功之后，所有 ttl 会被清除。

[[RedisClientParams.SetOptions]] 中 Expires 相关的三个选项 [[RedisClientParams.SetOptions.expire | expire]]、[[RedisClientParams.SetOptions.pexpire | pexpire]]、[[RedisClientParams.SetOptions.keepttl | keepttl]] 是互斥的。
存在多个时选择优先级最高的生效。优先级 [[RedisClientParams.SetOptions.keepttl | keepttl]] > [[RedisClientParams.SetOptions.expire | expire]] > [[RedisClientParams.SetOptions.pexpire | pexpire]]。

**注意**：由于 SET 的现有的选项可以使其实现 [[RedisClient.setnx | SETNX]]、[[RedisClient.setex | SETEX]]、[[RedisClient.psetex | PSETEX]] 以及 [[RedisClient.getset | GETSET]] 命令。
所以在未来的版本 Redis 可能删除这些命令。

例子：

```typescript
await client.set('mykey', 'Hello')
// "OK"
await client.get('mykey')
// "Hello"
await client.set('anotherkey', 'will expire in a minute', { expire: 60 })
// "OK"
```
