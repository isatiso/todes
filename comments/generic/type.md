> - **Redis官方文档**：https://redis.io/commands/type
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

查询值得存储类型。

### 返回值

字符串形式返回 key 处的值类型，如 `string`，`list`，`set`，`zset`，`hash`，`stream`。
当 key 不存在时 返回字符串 `none`。

例子：

```typescript
await client.set('key1', 'value')
// "OK"
await client.lpush('key2', 'value')
// 1
await client.sadd('key3', 'value')
// 1
await client.type('key1')
// "string"
await client.type('key2')
// "list"
await client.type('key3')
// "set"
```
