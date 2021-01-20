> - **Redis官方文档**：https://redis.io/commands/mset
> - **起始版本**：1.0.1
> - **时间复杂度**：O(N) N 为 key 的数量

按照给定参数设置 key value。只要有任何一个 key 是已经存在的，MSETNX 都不会执行。

- 基于 MSETNX 的这种语义，可以用来设置同一逻辑对象的不同 key。

返回值含义：

- `1` 全部 key 设置成功。
- `0` 设置失败。

例子：

```typescript
await client.msetnx({ key1: 'Hello', key2: 'there' })
// 1
await client.msetnx({ key2: 'new', key3: 'world' })
// 0
await client.mget(['key1', 'key2', 'key3'])
// ["Hello", "there", null]
```
