> - **Redis官方文档**：https://redis.io/commands/llen
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

返回指定 list 的长度。

- 如果 key 不存在被认为是个空 list，长度为 0。
- 如果 key 对应的值类型不是 list，抛出 WRONGTYPE 异常。

例子：

```typescript
await client.lpush('mylist', 'World')
// 1
await client.lpush('mylist', 'Hello')
// 2
await client.llen('mylist')
// 2
```
