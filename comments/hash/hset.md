> - **Redis官方文档**：https://redis.io/commands/hset
> - **起始版本**：2.0.0
> - **时间复杂度**：O(1) 对于每一对 field/value。所以 N 对 field/value 的复杂度为 O(N)。

将指定 hash 中的 field 设置为 value。如果 key 不存在，会创建一个新的 hash。如果 field 已经存在，它的值会被重写。

返回添加的 field 的个数。
被修改的 field 不被计算在内。

**注意**：在 4.0.0 版本开始，HSET 可以接受多组 field/value。更早的版本中，只能传递一对 field/value。

例子：

```typescript
await client.hset('myhash', { field1: 'Hello' })
// 1
await client.hget('myhash', 'field1')
// "Hello"
```
