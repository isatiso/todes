> - **Redis官方文档**：https://redis.io/commands/lpos
> - **起始版本**：6.0.6
> - **时间复杂度**：平均复杂度为 O(N) N 为列表的元素个数。当搜索结果临近列表头尾两端或者提供了 MAXLEN 参数时，运行时间可能是常量级的。

返回匹配目标 element 的元素索引。默认会从头向尾遍历，当找不到 element 时，返回 null。

关于 RANK 参数和 MAXLEN 参数说明见 [[RedisClientParams.LposOptions | LposOptions]]。

例子：

```typescript
await client.rpush('mylist', 'a', 'b', 'c', 'd', '1', '2', '3', '4', '3', '3', '3')
// 11
await client.lpos('mylist', '3')
// 6
await client.lpos('mylist', '3', 0, { rank: 2 })
// [8, 9, 10]
```
