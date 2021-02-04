> - **Redis官方文档**：https://redis.io/commands/migrate
> - **起始版本**：2.6.0
> - **时间复杂度**：该命令实际上在源实例中执行了 [[RedisGenericClient.dump | DUMP]] + [[RedisGenericClient.del | DEL]]，之后在目标实例中执行 [[RedisGenericClient.restore | RESTORE]]。
    > 这部分的时间复杂度，请参见这些命令的页面。在两个实例之间数据传输的复杂度为O(N)。

将 key 原子性的传输到目标 Redis 实例，成功后删除源 key。

在传输 key 的过程中，MIGRATE 命令会阻塞源实例和目标实例，任意时间 key 会存在源实例和目标实例中的一个。除非发生超时错误。

[comment]: <> (> ### 3.2 版本差异)

[comment]: <> (>)

[comment]: <> (> Redis 3.2 版本开始可以通过将前置参数 key 设为空字符串，并通过 KEYS 选项，传递多个 key。)

[comment]: <> (> [[RedisGenericClient.migrate]] 会自动检测传入的 key 个数，判断是否使用新的语法传递 key。)

[comment]: <> (> 更早的版本中，以此 [[RedisGenericClient.migrate ｜ MIGRATE]] 命令调用只能传递一个 key。)

MIGRATE 内部使用了 [[RedisGenericClient.dump | DUMP]] 进行序列化，之后使用 [[RedisGenericClient.restore | RESTORE]] 将值同步到目标实例上。
如果收到了目标实例上执行 [[RedisGenericClient.restore | RESTORE]] 命令返回的 `"OK"`，则使用 [[RedisGenericClient.del | DEL]] 删除源值。

`timeout` 参数指定了与目标实例交互的最长空闲时间，单位毫秒。这意味着这个命令不是必须在 timeout 时间内执行完，但是传输阻塞时间不能超过 timeout。

MIGRATE 命令需要执行带有超时限制的 I/O 操作。当 I/O 超时，或者发生了 I/O 异常，操作会被终止。此时可能出现两种情况。
- key 在两个实例上都有。
- key 只出现在源实例上。

超时并不会导致 key 丢失，但是需要检查是否已经存在于目标实例，并采取相应的措施。

当返回除此之外的其他异常时，MIGRATE 命令保证任何时刻 key 会且只会存在于源或者目标中的一个实例上（除非目标实例中已经存在相同 key）。

如果指定的一系列 key 在源实例上都不存在，会返回 `"NOKEY"`。因为正常情况下可能会丢失 key，比如因为到期。所以没有 key 可以传输并不是一个异常。

### 通过一次命令迁移多个 key

在 3.0.6 版本开始增加了批量迁移模式，通过管道批量进行迁移，以节省往返通信及其他间接的消耗。[[RedisGenericClient.migrate]] 会自动检测传入的 key 个数，判断是否使用批量迁移模式。

当启用了批量迁移模式时，只有当没有任何一个 key 可以被迁移时才会返回 NOKEY 状态，否则只要有至少一个 key 可以迁移，就会执行命令。

### 历史版本

\>= 3.0.0：添加了 copy 和 replace 选项。
\>= 3.0.6：支持批量迁移模式。
\>= 4.0.7：增加了 auth 选项，可以通过 password 进行认证。
\>= 6.0.0：增加了新的 auth 模式，可以同时提供 username 和 password。

### 返回值

- 成功返回 `"OK"`
- 如果没有任何 key 执行了迁移返回 `"NOKEY"`
