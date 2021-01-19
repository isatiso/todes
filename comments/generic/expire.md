> - **起始版本：**1.0.0
> - **时间复杂度：**O(1)

设置 key 的超时时间，到期后 key 会自动删除。

当删除或重写 key 的时候，例如 [[RedisClient.del | DEL]]，[[RedisClient.set | SET]]，[[RedisClient.getset | GETSET]] 和所有 *STORE 命令， 超时时间设置会被清除。
其他的诸如 [[RedisClient.incr | INCR]]，[[RedisClient.lpush | LPUSH]] 等概念上修改了 key 的操作，不会影响超时时间。

返回值含义：
- `1`：ttl 设置成功。
- `0`：key 不存在，设置失败。
