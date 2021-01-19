> - **起始版本：**1.0.0

选择从 0 开始计数的 Redis 逻辑数据库。

Redis 的可选数据库是一种命名空间格式。所有的数据仍然存在相同的 RDB / AOF 文件中。不同的数据库可以有相同的 key。
像 [[RedisClient.flushdb | FLUSHDB]] [[RedisClient.swapdb | SWAPDB]] [[RedisClient.randomkey | RANDOMKEY]] 可以在指定的数据库工作。
