> - **Redis官方文档**：https://redis.io/commands/hmset
> - **起始版本**：2.0.0
> - **时间复杂度**：O(N) N 是需要设置的 field 个数。

对指定 hash 设置 field/value 对，返回 OK。

- 已经存在的 field 会被重写。
- key 不存在的时候会创建一个新的 hash。
- key 存在但是类型不是 hash 会抛出异常。

**注意**：4.0.0 版本之后，[[RedisHashClient.hset | HSET]] 已经实现了多组 field/value 的写入功能。
所以此命令在之后的版本中可能被废弃，在新的代码中请使用 [[RedisHashClient.hset | HSET]]。

例子：

```typescript
await client.hmset('mykey', { field1: 'Hello', field2: 'World' })
// 2
await client.hget('mykey', 'field1')
// "Hello"
await client.hget('mykey', 'field2')
// "World"
```
