> - **Redis官方文档**：https://redis.io/commands/smismember
> - **起始版本**：6.2.0
> - **时间复杂度**：O(N) N 是需要检查的 member 数量。

返回指定 set 中一系列 member 的成员状态。对于每一个 member，1 表示是成员，0 表示不是成员。

- key 不存在时被认为是个空集，所以结果是一系列的 0。
- key 存在但是类型不是 set 会抛出异常。

例子：

```typescript
await client.sadd('myset', 'one')
// 1
await client.sadd('myset', 'one')
// 1
await client.smismember('myset', 'one', 'notamember')
// [1, 0]
```
