> - **Redis官方文档**：https://redis.io/commands/restore
> - **起始版本**：2.6.0
> - **时间复杂度**：O(1) 创建新 key，O(N * M)进行反序列化，其中 N 是组成该值的 Redis 对象的数量，M 是其平均大小。 对于较小的 string 值，时间复杂度为O(1) + O(1 * M)，其中 M 很小，可以简单地认为复杂度为 O(1)。 对于 zset，复杂度为 O(N * M * log(N))，因为将值插入排序的集合中的复杂度为 O(log(N))。

通过反序列化在 key 上创建新值。一般通过 [[RedisGenericClient.dump | DUMP]] 得到序列化的值。

如果 ttl 参数设置为 0，则 key 不会设置过期时间，否则设置为指定的毫秒级过期时间。

如果设置了 absttl 选项，ttl 参数会被解析为一个毫秒级的 UNIX 时间戳。

出于驱逐策略的目的，可以使用 idletime 参数和 freq 参数。相关信息参考 [[RedisGenericClient.object | OBJECT]] 命令（需要 Redis 5.0 及以上）。

可以使用 replace 选项指定是否覆盖已经存在的 key，如果未使用 replace 选项，且 key 已经存在，会返回 `Target key name is busy` 错误（需要 Redis 3.0 及以上）。

RESTORE 会检查序列化值的校验和。如果不匹配会抛出异常。

例子：

```typescript
await client.del('mykey')
// 0
await client.restore('mykey', 0,  Buffer.from([0x0e, 0x01, 0x11, 0x11, 0x00, 0x00, 0x00, 0x0e, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0xf4, 0x02, 0xf3, 0x02, 0xf2, 0xff, 0x09, 0x00, 0xcb, 0xe7, 0x54, 0x27, 0x45, 0xe3, 0x3b, 0x2a]))
// "OK"
await client.type('mykey')
// "list"
await client.lrange('mykey', 0, -1)
// ["3", "2", "1"]
```
