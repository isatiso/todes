> - **Redis官方文档**：https://redis.io/commands/lset
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N) N 是 list 的长度。设置第一个或最后一个元素的时间为 O(1)。

设置 list 指定索引的元素。对于 list 索引的更多信息见 [[RedisListClient.lindex | LINDEX]]。

- 对于超出 list 范围的索引会抛出异常。

例子：

```typescript
await client.rpush('mylist', 'one')
// 1
await client.rpush('mylist', 'two')
// 2
await client.rpush('mylist', 'three')
// 3
await client.lset('mylist', 0,'four')
// "OK"
await client.lset('mylist', -2, 'five')
// "OK"
await client.lrange('mylist', 0, -1)
// ["four", "five", "three"]
```
