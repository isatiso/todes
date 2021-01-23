> - **Redis官方文档**：https://redis.io/commands/ltrim
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N) N 需要移除的元素个数。

裁剪指定 list，返回 OK。裁剪后 list 只包含参数指定范围的元素。

- start 和 stop 都是从 0 计数的索引。
- start 和 stop 都可以使用负数索引。详见 [[RedisListClient.lindex | LINDEX]] 命令说明。
- 超出范围的索引不会引起异常，start 超过 list 范围会生成空列表，stop 超过 list 范围会被认为 stop 就是 list 最后一个元素。

例子：

```typescript
await client.rpush('mylist', 'one')
// 1
await client.rpush('mylist', 'two')
// 2
await client.rpush('mylist', 'three')
// 3
await client.ltrim('mylist', 1, -1)
// "OK"
await client.lrange('mylist', 0, -1)
// ["two", "three"]
```
