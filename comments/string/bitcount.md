> - **Redis官方文档**：https://redis.io/commands/bitcount
> - **起始版本**：2.6.0
> - **时间复杂度**：O(N)

统计字符串中 1 的个数（填充计数）。默认情况下将检查字符串的所有字节。 可以通过 range 参数控制指定范围的字节计数。

如果只设置了 start 没有设置 end，end 会被设置为 -1。

例子：

```typescript
await client.set('mykey', 'foo')
// "OK", foo 对应的字节序列为 01100110 01101111 01101111
await client.bitcount('mykey')
// 16
await client.bitcount('mykey', [0, 0])
// 4
await client.bitcount('mykey', [1, 1])
// 6
```
