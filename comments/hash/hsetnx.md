> - **Redis官方文档**：https://redis.io/commands/hsetnx
> - **起始版本**：2.0.0
> - **时间复杂度**：O(1)

将指定 hash 中的 field 不存在时，将其设置为 value。
如果 field 存在操作没有任何影响。
如果 key 的类型不是 hash，会抛出异常。

- `1` 当 field 不存在并且设置了新的 field。
- `0` 当 field 已经存在，未执行任何操作。

例子：

```typescript
await client.hsetnx('myhash', 'field', 'Hello' )
// 1
await client.hsetnx('myhash', 'field', 'World' )
// 0
await client.hget('myhash', 'field' )
// "Hello"
```
