> - **Redis官方文档**：https://redis.io/commands/blmove
> - **起始版本**：6.2.0
> - **时间复杂度**：O(1)

BLMOVE 是阻塞版本的 [[RedisListClient.lmove ｜ LMOVE]] 命令。

- 当 src 中没有元素时，Redis 会阻塞连接，直到有其他的客户端向 src 中推入元素或者超时。
- 当 src 中有元素时，它的行为和 [[RedisListClient.lmove ｜ LMOVE]] 一致。
- 在 MULTI/EXEC 中时，它的行为和 [[RedisListClient.lmove ｜ LMOVE]] 一致。
- timeout 设置为 0，表示不限时阻塞。

返回从 src pop 出来的元素。如果超时则会返回 null。
