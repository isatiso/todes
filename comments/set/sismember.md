> - **Redis官方文档**：https://redis.io/commands/sismember
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

判断 member 是否是给定 set 的元素。

返回值含义：
- `1` member 是给定集合的元素。
- `0` member 不是给定集合的元素，或者 key 不存在。

key 存在但是类型不是 set 的时候会抛出 WRONGTYPE Error。

例子：

```typescript
await client.sadd('myset', 'one')
// 1
await client.sismember('myset', 'one')
// 1
await client.sismember('myset', 'two')
// 0
```
