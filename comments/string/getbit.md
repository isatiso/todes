> - **Redis官方文档**：https://redis.io/commands/getbit
> - **起始版本**：2.2.0
> - **时间复杂度**：O(1)

返回指定 key 的 offset 处的 bit 值。

- 如果 offset 超过字符串的长度，返回 0。
- 如果 key 不存在，则被认为是个空字符串，此时 offset 是溢出的，同样返回 0。

例子：

```typescript
await client.setbit('mykey', 7, 1)
// 0
await client.getbit('mykey', 0)
// 0
await client.getbit('mykey', 7)
// 1
await client.getbit('mykey', 100)
// 0
```
