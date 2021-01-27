> - **Redis官方文档**：https://redis.io/commands/srem
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N) N 是要移除的 member 数量。

从 set 移除指定的一系列 member。如果指定的 member 不在 set 中，则被忽略。
如果 key 不存在被认为是个空的 set。如果 key 对应的值不是 set 类型会抛出异常。

**注意**：2.4 版本开始支持传递多个 member。更早的版本中一次命令调用只能移除一个 member。

例子：

```typescript
await client.sadd('myset', 'one', 'two', 'three')
// 3
await client.srem('myset', 'one', 'four')
// 1
await client.smembers('myset')
// ["three", "two"]
```
