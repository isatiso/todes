> - **Redis官方文档**：https://redis.io/commands/lpop
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N) N 为返回的元素个数。

从 list 左侧移除并返回一个值。

- 使用 count 参数时会返回一个列表，key 不存在则返回 null。
- 不用 count 的时候返回单个值。

例子：

```typescript
await client.rpush('mylist', 'one')
// 1
await client.rpush('mylist', 'two')
// 2
await client.rpush('mylist', 'three')
// 3
await client.lpop('mylist')
// "one"
await client.lrange('mylist', 0, -1)
// ["two", "three"]
```
