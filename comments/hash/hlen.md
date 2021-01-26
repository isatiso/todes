> - **Redis官方文档**：https://redis.io/commands/hlen
> - **起始版本**：2.0.0
> - **时间复杂度**：O(1)

返回指定 hash 的 field 个数。

- 如果 key 不存在，返回 0。

例子：

```typescript
await client.hset('mykey', { field1: 'Hello' })
// 1
await client.hset('mykey', { field2: 'World' })
// 1
await client.hlen('mykey')
// 2
await client.hlen('nonexist')
// 0
```
