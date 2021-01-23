> - **Redis官方文档**：https://redis.io/commands/lrem
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N+M) N 是列表长度，M 是需要移除的元素个数。

对指定 list 移除前 count 个匹配 element 的元素。返回移除元素的个数。

- count 大于 0 时，从左侧开始匹配 element 进行移除操作。
- count 小于 0 时，从右侧开始匹配 element 进行移除操作。
- count 等于 0 时，移除全部匹配 element 的元素。

**注意**：不存在的 key 会被认为是空的 list，所以移除元素的个数为 0。

例子：

```typescript
await client.rpush('mylist', 'hello')
// 1
await client.rpush('mylist', 'hello')
// 2
await client.rpush('mylist', 'foo')
// 3
await client.rpush('mylist', 'hello')
// 4
await client.lrem('mylist', -2, 'hello')
// 2
await client.lrange('mylist', 0, -1)
// ["hello", "foo"]
```
