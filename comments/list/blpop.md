> - **Redis官方文档**：https://redis.io/commands/blpop
> - **起始版本**：2.0.0
> - **时间复杂度**：O(1)

BLPOP 是阻塞版本的 [[RedisListClient.lpop ｜ LPOP]] 命令，当参数中指定的所有 list 都没有元素的时候，它会阻塞连接。
它会从第一个 list 的头部弹出一个非空的元素，并以给定的 key 顺序进行检查。

**注意**：timeout 参数在早期的 redis 版本会被解释为整型，6.0.0 及以上版本会被解释为双精度浮点数。

例子：
