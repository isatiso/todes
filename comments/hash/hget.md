> - **Redis官方文档**：https://redis.io/commands/hget
> - **起始版本**：2.0.0
> - **时间复杂度**：O(1)

返回 hash 中指定 field 的值，如果 key 不存在或者 field 不存在返回 null。

例子：

```typescript
await client.hset('myhash', { field1: 'foo' })
// 1
await client.hget('myhash', 'field1')
// "foo"
await client.hget('myhash', 'field2')
// null
await client.hget('nonexists', 'field2')
// null
```
