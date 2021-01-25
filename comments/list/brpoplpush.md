> - **Redis官方文档**：https://redis.io/commands/brpoplpush
> - **起始版本**：2.2.0
> - **时间复杂度**：O(1)

BRPOPLPUSH 是阻塞版本的 [[RedisListClient.rpoplpush ｜ RPOPLPUSH]] 命令。

- 当 source 包含元素的时候，此命令的行为和 [[RedisListClient.rpoplpush ｜ RPOPLPUSH]] 一致，返回弹出的元素。
- 在事务（MULTI/EXEC）中，此命令的行为和 [[RedisListClient.rpoplpush ｜ RPOPLPUSH]] 一致，返回弹出的元素。
- 超时后返回 null。

BRPOP 和 [[RedisListClient.blpop | BLPOP]] 的区别只是弹出元素的位置是尾部。其他的语义详情见 [[RedisListClient.blpop | BLPOP]] 命令文档。

**注意**：timeout 参数在早期的 redis 版本会被解释为整型，6.0.0 及以上版本会被解释为双精度浮点数。

**注意**：6.2.0 增加了 [[RedisListClient.blmove | BLMOVE]] 命令，BRPOPLPUSH 有可能被弃用。考虑使用 [[RedisListClient.blmove | BLMOVE]] 替代 BRPOPLPUSH。
