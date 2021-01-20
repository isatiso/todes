> - **Redis官方文档**：https://redis.io/commands/setbit
> - **起始版本**：2.0.0
> - **时间复杂度**：O(1)

如果 key 不存在，则设置 key 的值为一个 string。

返回值：
- `1` 表示 key 设置成功。
- `0` 表示 key 没有设置成功。

例子：

```typescript
await client.setnx('mykey', 'Hello')
// 1
await client.setnx('mykey', 'World')
// 0
await client.get('mykey')
// "Hello"
```
