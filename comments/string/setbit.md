> - **Redis官方文档**：https://redis.io/commands/setbit
> - **起始版本**：2.2.0
> - **时间复杂度**：O(1)

将 string 类型的 key 是做一个 bit 数组。将下标为 offset 的 bit 设为 1 或 0，并返回旧的 bit 的值。

- 如果 key 不存在，先创建空字符串。
- offset 参数取值范围为左闭右开区间 [0, 2^32)。这限制了 bitmap 最大为 512M。
- 跳过的位会被设置为 0。比如 mykey 不存在。`client.setbit('mykey', 7, 1)` 会将 mykey 设置为 00000001。

**注意**：当设置了最大有效位（offset 2^32 - 1 512M），但是 key 不存在或者存在但是是个小字符串， 此时 Redis 需要分配完整大小的内存，这可能会阻塞服务一段可观的时间。

在 2010 款的 MacBook Pro上：

- 设置 offset 2^32 - 1（512M），大约消耗 300ms。
- 设置 offset 2^30 - 1（128M），大约消耗 80ms。
- 设置 offset 2^28 - 1（32M），大约消耗 30ms。
- 设置 offset 2^26 - 1（8M），大约消耗 8ms。

例子：

```typescript
await client.setbit('mykey', 7, 1)
// 0
await client.setbit('mykey', 7, 0)
// 1
await client.get('mykey')
// "\u0000"
```
