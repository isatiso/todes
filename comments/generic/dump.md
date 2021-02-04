> - **Redis官方文档**：https://redis.io/commands/dump
> - **起始版本**：2.6.0
> - **时间复杂度**：访问 key 为 O(1), 之后需要额外的 O(N * M) 进行序列化。N 为 组成该值的 Redis 对象数量，M 为他们的平均大小。对于小的 string 类型的值，时间复杂度为 O(1) + O(1 * M)，而 M 又很小，可以简化为 O(1)。

序列化导出 key 处的值。当 key 不存在返回 null。
可以使用 [[RedisGenericClient.restore | RESTORE]] 命令可以进行反序列化并存储。

**Redis 采用了一种非标准不透明的序列化方式，它的语义上有一些特点，如下**：
- 带有 64 位校验和，用于检测错误。 [[RedisGenericClient.restore | RESTORE]] 反序列化之前会先进行校验。
- 值的编码格式和 RDB 保持一致。
- RDB 版本会被编码在序列化值当中，如果因为 Redis 的版本不同造成 RDB 格式不兼容，那么 Redis 会拒绝对这个值进行反序列化。

**序列化的值不包含任何 TTL 信息。**

### 返回值

序列化后的结果，可能无法编码为字符串，所以直接返回 Buffer。对于不存在的 key 返回 null。

例子：

```typescript
await client.set('mykey', '10')
// "OK"
await client.dump('mykey')
// <Buffer 00 c0 0a 09 00 be 6d 06 89 5a 28 00 0a>
```
