> - **Redis官方文档**：https://redis.io/commands/lindex
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N) N 为到达 index 指定位置需要遍历的元素个数。所以访问 index 为 1 或 -1 的情况下，复杂度为 O(1)。

返回指定列表的 index 处的元素。

- index 是从 0 开始计算的。index 为 0 表示第一个元素，index 为 1 表示第二个元素，以此类推。
- 当 index 为负数时，表示从 list 末端开始遍历。-1 表示最后一个元素，-2 表示倒数第二个元素，以此类推。
- 当指定的 key 不是 list 类型的时候抛出异常。
- 当指定 index 超出列表长度限制返回 null。

例子：

```typescript
await client.lpush('mylist', 'World')
// 1
await client.lpush('mylist', 'Hello')
// 2
await client.lindex('mylist', 0)
// "Hello"
await client.lindex('mylist', -1)
// "World"
await client.lindex('mylist', 3)
// null
```
