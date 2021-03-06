> - **Redis官方文档**：https://redis.io/commands/unlink
> - **起始版本**：4.0.0
> - **时间复杂度**：删除每个键的复杂度为 O(1) 和值大小无关。在之后的回收内存操作的复杂度为 O(N)，N 为组成待回收对象的分配空间大小。

此命令和 [[RedisClient.del | DEL]] 作用相似，删除指定的 key(s)，不存在则被跳过。
区别是 UNLINK 只会同步的从 keyspace 中删除 key，回收内存的工作是在另外的线程中异步执行的。所以性能会比 [[RedisClient.del | DEL]] 好一些。

例子：

```typescript
await client.set('key1', 'Hello')
// "OK"
await client.set('key2', 'World')
// "OK"
await client.unlink('key1', 'key2', 'key3')
// 2
```
