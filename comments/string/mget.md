> - **Redis官方文档**：https://redis.io/commands/mget
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N) N 为 key 的数量

返回所有指定的 key 对应的值的列表。

- 对于不存在的或者类型不是 string 的 key，统一返回 null。所以此命令永远不会失败。

例子：

```typescript
await client.set('key1', 'Hello')
// "OK"
await client.set('key2', 'World')
// "OK"
await client.mget(['key1', 'key2', 'nonexisting'])
// ["Hello", "World", null]
await client.mget(['key1', 'key2', 'nonexisting'], true)
// [ <Buffer 48 65 6c 6c 6f>, <Buffer 57 6f 72 6c 64>, null ]
```
