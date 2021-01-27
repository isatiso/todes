> - **Redis官方文档**：https://redis.io/commands/scard
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

返回集合基数（元素数）。

- key 不存在时返回 0。

例子：

```typescript
await client.sadd('myset', 'Hello')
// 1
await client.sadd('myset', 'World')
// 1
await client.scard('myset')
// 2
```
