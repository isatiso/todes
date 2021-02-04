> - **Redis官方文档**：https://redis.io/commands/renamenx
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

当 newkey 不存在时重命名 key 到 newkey。当 key 不存在时抛出异常。

在集群模式中，key 和 newkey 都必须在同一个 `hash slot` 中，这意味着在集群中，具有相同的 hash tag 的的 key 才能被可靠的重命名。

### 历史版本

\<= 3.2.0：如果 key 和 newkey 相同，会抛出异常。

### 返回值

- `1` 如果重命名成功。
- `0` 如果新的 key 已经存在。

例子：

```typescript
await client.set('mykey', 'Hello')
// "OK"
await client.set('myotherkey', 'World')
// "OK"
await client.renamenx('mykey', 'myotherkey')
// 0
await client.get('myotherkey')
// "World"
```
