> - **Redis官方文档**：https://redis.io/commands/hmget
> - **起始版本**：2.0.0
> - **时间复杂度**：O(N) N 是请求的 field 个数。

返回指定 hash 的指定 field 值。

- 对于每个不存在的 field 其结果为 null。
- 对于不存在的 key，认为他是个空的 hash，此时会返回一个全是 null 的列表。

例子：

```typescript
await client.hset('mykey', { field1: 'Hello' })
// 1
await client.hset('mykey', { field2: 'World' })
// 1
await client.hmget('mykey', ['field1', 'field2', 'nofield'])
// ["Hello", "World", null]
await client.hmget('nokey', ['field1', 'field2', 'nofield'])
// [null, null, null]
```
