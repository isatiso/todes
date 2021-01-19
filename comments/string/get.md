> - **Redis官方文档**：https://redis.io/commands/get
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

获取 key 对应的值。

- 如果 key 不存在返回 null。
- 如果 key 的值类型不是 string 抛出异常。

**注意**：由于 Redis 的 String 可以存储二进制数据，对于不需要解析为字符串的结果，可以通过将 return_buffer 设为 true 阻止将结果转换为字符串。

例子：

```typescript
await client.get('nonexisting')
// null
await client.set('mykey', 'Hello')
// "OK"
await client.get('mykey')
// "Hello"
await client.get('mykey', true)
// <Buffer 48 65 6c 6c 6f>
```
