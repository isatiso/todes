> - **Redis官方文档**：https://redis.io/commands/bitop
> - **起始版本**：2.6.0
> - **时间复杂度**：O(N)

执行按位运算并将结果存储在 dest 中。 对于多个字符串长度不统一的情况，短字符串不足长度用 0 补足。

返回保存到 dest 的字符串的长度，该值和输入 keys 中最长的字符串长度相等。

例子：

```typescript
await client.set('key1', 'foobar')
// "OK"
await client.set('key2', 'abcdef')
// "OK"
await client.bitop('AND', 'dest', ['key1', 'key2'])
// 6
await client.get('dest')
// "`bc`ab"
```
