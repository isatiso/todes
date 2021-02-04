> - **Redis官方文档**：https://redis.io/commands/persist
> - **起始版本**：2.2.0
> - **时间复杂度**：O(1)

移除存在于 key 上的过期时间，将 key 从 volatile 变成 persistent。

### 返回值

- `1` 成功清除 ttl。
- `0` 当 key 不存在或存在但未设置 ttl。

例子：

```typescript
await client.set('mykey', 'Hello')
// "OK"
await client.expire('mykey', 10)
// 1
await client.ttl('mykey')
// 10
await client.persist('mykey')
// 1
await client.ttl('mykey')
// -1
```
