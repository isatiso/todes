> - **Redis官方文档**：https://redis.io/commands/brpop
> - **起始版本**：2.0.0
> - **时间复杂度**：O(1)

BRPOP 是阻塞版本的 [[RedisListClient.rpop ｜ RPOP]] 命令。

BRPOP 和 [[RedisListClient.blpop | BLPOP]] 的区别只是弹出元素的位置是尾部。其他的语义详情见 [[RedisListClient.blpop | BLPOP]] 命令文档。

**注意**：timeout 参数在早期的 redis 版本会被解释为整型，6.0.0 及以上版本会被解释为双精度浮点数。
