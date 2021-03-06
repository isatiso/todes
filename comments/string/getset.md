> - **Redis官方文档**：https://redis.io/commands/getset
> - **起始版本：**1.0.0
> - **时间复杂度：**O(1)

原子性的设置 key，并返回原值。如果 key 已经存在但值不是 string 类型，抛出异常。

**注意**：在 6.2 版本，此方法可能会被废弃。请使用 [[RedisClient.set | SET]] 命令以及 GET 选项。

例子：

```typescript
await client.set('mykey', 'Hello')
// "OK"
await client.getset('mykey', 'World')
// "Hello"
await client.get('mykey')
// "World"
await client.getset('mykey', 'Whatever', true)
// <Buffer 57 6f 72 6c 64>
await client.get('mykey')
// "Whatever"
```
