> - **Redis官方文档**：https://redis.io/commands/setbit
> - **起始版本**：2.0.0
> - **时间复杂度**：O(1)

设置 key 的值为一个 string，同时设置过期时间。

- 此命令是原子性的，常用作缓存。

例子：

```typescript
await client.setex('mykey', 'Hello', 10)
// "OK"
await client.ttl('mykey')
// 10
await client.get('mykey')
// "Hello"
```
