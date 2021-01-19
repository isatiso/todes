> - **起始版本：**2.6.0
> - **时间复杂度：**该命令实际上在源实例中执行了 [[RedisClient.dump | DUMP]] + [[RedisClient.del | DEL]]，而在目标实例中执行 [[RedisClient.restore | RESTORE]]。
    > 这部分的时间复杂度，请参见这些命令的页面。在两个实例之间数据传输的复杂度为O(N)。

将 key 原子性的传输到目标 Redis 实例。

成功时返回 OK, 找不到 key 返回 NOKEY。 当执行多个 key 时，只要有至少一个可以执行 migrate 的 key，即返回 OK。否则如果源数据中找不到任何返回 NOKEY。
