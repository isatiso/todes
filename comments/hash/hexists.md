> - **Redis官方文档**：https://redis.io/commands/hexists
> - **起始版本**：2.0.0
> - **时间复杂度**：O(1)

返回 hash 中是否存在指定 field。

返回值：
- `1` 表示 hash 包含指定的 field。
- `0` 表示 hash 不包含指定的 field，或者 hash 不存在。
- 当 key 存在但是类型不是 hash 的时候，抛出异常。

例子：

```typescript
await client.hset('myhash', { field1: 'foo' })
// 1
await client.hexists('myhash', 'field1')
// 1
await client.hexists('myhash', 'field2')
// 0
```
