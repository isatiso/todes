> - **Redis官方文档**：https://redis.io/commands/lmove
> - **起始版本**：6.2.0
> - **时间复杂度**：O(1)

原子性的从 src 列表弹出一个元素并推入 dest 列表，并返回该元素。

- 如果 src 不存在，返回 null。
- 当 src 和 dest 相同时，可以认为这是一个列表循环移动的操作。

例子：

```typescript
await client.rpush('mylist', 'one')
// 1
await client.rpush('mylist', 'two')
// 2
await client.rpush('mylist', 'three')
// 3
await client.lmove('mylist', 'myotherlist', 'RIGHT', 'LEFT')
// "one"
await client.lmove('mylist', 'myotherlist', 'LEFT', 'RIGHT', true)
// <Buffer 6f 6e 65>，即 "two"
await client.lrange('mylist', 0, -1)
// ["two"]
await client.lrange('myotherlist', 0, -1)
// ["three", "one"]
```
