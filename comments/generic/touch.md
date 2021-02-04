> - **Redis官方文档**：https://redis.io/commands/touch
> - **起始版本**：3.2.1
> - **时间复杂度**：O(N) 其中 N 是将 key 的数量。

此命令会修改 key 的最后访问时间。返回存在的 key 的个数。

### 返回值

返回触碰到（touched）的 key 的数量。

例子：

```typescript
await client.set('key1', 'Hello')
// "OK"
await client.set('key2', 'World')
// "OK"
await client.touch('key1', 'key2')
// 2
```
