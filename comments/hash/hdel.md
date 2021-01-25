> - **Redis官方文档**：https://redis.io/commands/hdel
> - **起始版本**：2.0.0
> - **时间复杂度**：O(N) N 为待删除的 field 个数。

移除指定 key（hash 类型）的指定 field，并返回移除的 field 的个数。

- 对于不存在的 field 会被忽略。
- 如果 key 不存在，会被认为是个空的 hash，并且返回 0。

**注意**：2.4 版本开始支持多个 field 参数，更早的版本一次命令只能移除一个 field。如果在更早的版本中希望一次移除多个 field，请使用 MULTI/EXEC 事务块。

例子：

```typescript
await client.hset('myhash', { field1: 'foo' })
// 1
await client.hdel('myhash', 'field1')
// 1
await client.hdel('myhash', 'field1')
// 0
```
