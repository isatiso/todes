> - **Redis官方文档**：https://redis.io/commands/exists
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

判断 key 是否存在

**3.0.3** 版本开始可以传递多个 key。此时会返回存在的 key 的个数。 因为对于单个 key 的使用场景，1 表示存在一个 key，所以这个改动是完全向后兼容的。

**注意**：如果在参数中有重复的 key 并且这个 key 是存在的，那么最终计数会对这个 key 统计多次。

### 返回值

- `1`：当 key 存在。
- `0`：当 key 不存在。
- 3.0.3 版本开始，返回存在的 key 的个数。

例子：

```typescript
await client.set('key1', 'Hello')
// "OK"
await client.exists('key1')
// 1
await client.exists('nosuchkey')
// 0
await client.set('key2', 'World')
// "OK"
await client.exists('key1', 'key2', 'nosuchkey')
// 2
await client.exists('key1', 'key1', 'key1')
// 3
```
