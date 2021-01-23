> - **Redis官方文档**：https://redis.io/commands/rpush
> - **起始版本**：1.0.0
> - **时间复杂度**：单个元素的添加复杂度为 O(1)，所以添加 N 个元素的复杂度为 O(N)。

向指定 list 末尾添加所有指定的 value。返回添加后的 list 长度。

- 如果 key 不存在，会先创建一个空的 list。
- 如果 key 存在但是类型不是 list，会抛出异常。

**注意**：早期版本只能推入一个值，2.4 及以上版本可以支持多个值的推入。

例子：

```typescript
await client.rpush('mylist', 'hello')
// 1
await client.rpush('mylist', 'world')
// 2
await client.lrange('mylist', 0, -1)
// ["hello", "world"]
```
