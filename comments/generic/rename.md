> - **Redis官方文档**：https://redis.io/commands/rename
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

重命名 key 到 newkey。当 key 不存在时抛出异常。

- 如果 newkey 已经存在，则会对其进行重写。
- 由于 RENAME 的执行包含隐式的 [[RedisClient.del | DEL]] 操作。所以尽管 RENAME 的耗时通常是常量的，但如果需要删除的值很大，也会引起很高的延迟。

在集群模式中，key 和 newkey 都必须在同一个 `hash slot` 中，这意味着在集群中，具有相同的 hash tag 的的 key 才能被可靠的重命名。

### 历史版本

\<= 3.2.0：如果 key 和 newkey 相同，会抛出异常。

例子：

```typescript
await client.set('mykey', 'Hello')
// "OK"
await client.rename('mykey', 'myotherkey')
// "OK"
await client.get('myotherkey')
// "Hello"
```
