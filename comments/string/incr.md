> - **Redis官方文档**：https://redis.io/commands/incr
> - **起始版本**：1.0.0
> - **时间复杂度**：O(1)

将 key 处存储的数字加 1，并返回处理之后的结果。

[[RedisClient.incrby | INCRBY]] [[RedisClient.decr | DECR]] [[RedisClient.decrby | DECRBY]] 三个命令的行为和 INCR
很基本一致。都具有如下特点：

- 如果 key 不存在，在加 1 之前会先将 key 设置为 0。
- 如果 key 包含的类型不是数字形式的字符串，则会抛出异常。
- 能处理数据极限为 64 位有符号整型，溢出时会抛出异常。

**注意**：Javascript 的 number 类型实际为 64 位浮点型。精确表示的整型范围达不到 64 位有符号整型的最大值和最小值。 可以参考 Javascript 的 `Number.MAX_SAFE_INTEGER`
和 `Number.MIN_SAFE_INTEGER`。 此命令默认按照 Redis 的返回类型 integer 进行解析。当处理结果很大时，为了避免丢失精度，可以通过将 string_number 设为 true 阻止将结果转换为数字。

对于 [[RedisClient.incrby | INCRBY]] [[RedisClient.decrby | DECRBY]] delta 也可能超过 Javascript 的最大整型值，此时请使用 string
类型传递参数。
