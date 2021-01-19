> - **起始版本：**2.6.0
> - **时间复杂度：**O(1)

效果和 [[RedisClient.expireat | EXPIREAT]] 一样，区别是 PEXPIREAT 的到期时间戳是毫秒单位的。

返回值含义：
- `1` ttl 设置成功。
- `0` key 不存在，设置失败。
