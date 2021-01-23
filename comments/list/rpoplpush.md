> - **Redis官方文档**：https://redis.io/commands/rpoplpush
> - **起始版本**：1.2.0
> - **时间复杂度**：O(1)

原子性的从源列表末尾弹出一个值，并推入存储列表头部。返回这个值。

- 如果源列表不存在，返回 null 并且不会执行任何操作。
- 源列表和存储列表可以相同。

**注意**：在 6.2 版本此命令可能会被废弃，使用 [[RedisListClient.lmove | LMOVE]] 命令替代。

例子：

```typescript
await client.rpush('mylist', 'one')
// 1
await client.rpush('mylist', 'two')
// 2
await client.rpush('mylist', 'three')
// 3
await client.rpoplpush('mylist', 'myotherlist')
// "three"
await client.lrange('mylist', 0, -1)
// ["one", "two"]
await client.lrange('myotherlist', 0, -1)
// ["three"]
```
