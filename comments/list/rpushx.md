> - **Redis官方文档**：https://redis.io/commands/lpushx
> - **起始版本**：2.2.0
> - **时间复杂度**：单个元素的添加复杂度为 O(1)，所以添加 N 个元素的复杂度为 O(N)。

仅当指定的 key 存在并且值为 list 时，向 list 末尾添加所有指定的 value。返回添加后的 list 长度。

- 如果 key 不存在或者 key 存在但是类型不是 list，不会执行任何操作。

**注意**：早期版本只能推入一个值，4.0 及以上版本可以支持多个值的推入。

例子：

```typescript
await client.rpush('mylist', 'Hello')
// 1
await client.rpushx('mylist', 'World')
// 2
await client.rpushx('myotherlist', "World")
// 0
await client.lrange('mylist', 0, -1)
// ["Hello", "World"]
await client.lrange('myotherlist', 0, -1)
// []
```
