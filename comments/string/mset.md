> - **Redis官方文档**：https://redis.io/commands/mset
> - **起始版本**：1.0.1
> - **时间复杂度**：O(N) N 为 key 的数量

按照给定的 key value 批量进行 set 操作。

- MSET 命令是原子性的，要么全部成功，要么全部失败。
- 对于已经存在的 key，MSET 会进行重写。如果你不希望重写，请参考 [[RedisClient.msetnx | MSETNX]]。

MSET 始终返回 OK。

例子：

```typescript
await client.mset({ key1: 'Hello', key2: 'World' })     // "OK"
await client.get('key1')                                // "Hello"
await client.get('key2')                                // "World"
```
