> - **Redis官方文档**：https://redis.io/commands/hkeys
> - **起始版本**：2.0.0
> - **时间复杂度**：O(N) N 为 hash 的大小。

返回指定 hash 的所有 field 名字。

- 如果 key 不存在，返回空列表。

例子：

```typescript
await client.hset('mykey', { field1: 'Hello' })
// 1
await client.hset('mykey', { field2: 'World' })
// 1
await client.hkeys('mykey')
// ["field1", "field2"]
```
