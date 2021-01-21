> - **Redis官方文档**：https://redis.io/commands/linsert
> - **起始版本**：2.2.0
> - **时间复杂度**：O(N) N 为到达指定位置 pivot 需要遍历的元素个数。这意味着从列表左侧插入元素为 O(1)，从右侧插入元素为 O(N)。

在 list 指定位置 pivot 的前面或者后面插入 element。

- 如果 key 不存在，则被认为是一个空 list，意味着什么也不会执行。
- 当 key 存在但是值的类型不是 list，则会抛出异常。

返回插入后的 list 长度。如果 没找到 pivot 则会返回 -1。

例子：

```typescript
await client.rpush('mylist', 'Hello')
// 1
await client.rpush('mylist', 'World')
// 2
await client.linsert('mylist', 'BEFORE', 'World', 'There')
// 3
await client.lrange('mylist', 0, -1)
// ["Hello", "There", "World"]
```
