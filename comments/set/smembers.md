> - **Redis官方文档**：https://redis.io/commands/smembers
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N) N 是集合基数。

列出全部给定集合的元素。对于只传递一个 key 的 [[RedisSetClient.sinter | SINTER]] 操作效果一样。

- key 不存在被认为是空集。
- key 存在但是类型不是 set 会抛出异常。

例子：

```typescript
await client.sadd('myset', 'Hello', 'World')
// 2
await client.smembers('myset')
// ["World", "Hello"]
```
