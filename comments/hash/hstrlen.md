> - **Redis官方文档**：https://redis.io/commands/hstrlen
> - **起始版本**：3.2.0
> - **时间复杂度**：O(1)

返回 hash 中指定 field 的值的长度。如果 key 不存在或者 field 不存在，返回 0。

例子：

```typescript
await client.hset('myhash', { f1: 'HelloWorld', f2: '99', f3: '-256' })
// 3
await client.hstrlen('myhash', 'f1')
// 10
await client.hstrlen('myhash', 'f2')
// 2
await client.hstrlen('myhash', 'f3')
// 4
```
