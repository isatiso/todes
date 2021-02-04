> - **Redis官方文档**：https://redis.io/commands/del
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N)，N 为需要删除的 key 的个数。

从当前 db 删除 key，不存在的 key 会被忽略。

### 返回值

返回删除的成员数，不包括不存在的 key。

例子：

```typescript
await client.set('key1', 'Hello')
// "OK"
await client.set('key2', 'World')
// "OK"
await client.del('key1', 'key2', 'nonexists')
// 2
```
