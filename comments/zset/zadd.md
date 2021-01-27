> - **Redis官方文档**：https://redis.io/commands/zadd
> - **起始版本**：1.2.0
> - **时间复杂度**：每添加一个 item 的复杂度是 O(log(N))，N 是 zset 包含的元素

向 zset 中添加指定的 member/score。

- 当 key 不存在会先创建个空的 zset。
- 当 key 对应的值不是 zset，会抛出异常。


例子：

```typescript
await client.sadd('myset', 'Hello')
// 1
await client.sadd('myset', 'World')
// 1
await client.sadd('myset', 'World')
// 0
await client.smembers('myset')
// ["World", "Hello"]
```
