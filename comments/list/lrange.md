> - **Redis官方文档**：https://redis.io/commands/lrange
> - **起始版本**：1.0.0
> - **时间复杂度**：O(S + N) S 是从列表头到 start 位置的距离，对于大列表是到最近的端的距离。N 是 start 到 end 的区间范围。

返回指定 list 中指定范围的元素。

- start 和 stop 是从 0 开始计数的索引值。
- start 和 stop 也可以是负数，表示从末尾开始计数，-1 表示最后一个元素，-2 表示倒数第二个元素。
- 超出 list 范围的索引不会引起异常。如果 start 大于 list 的最大索引，会返回一个空列表，stop 如果超出了 list 最大索引，Redis 会假装他是 list 的最后一个元素。

**注意**：选取范围是 [start, stop] 的闭区间，即 start 和 stop 都是被包含在内的。


例子：

```typescript
await client.rpush('mylist', 'one')
// 1
await client.rpush('mylist', 'two')
// 2
await client.rpush('mylist', 'three')
// 3
await client.lrange('mylist', 0, 0)
// ["one"]
await client.lrange('mylist', -3, 2)
// ["one", "two", "three"]
await client.lrange('mylist', -100, 100)
// ["one", "two", "three"]
await client.lrange('mylist', 5, 10)
// []
```
