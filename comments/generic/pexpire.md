> - **起始版本：**2.6.0
> - **时间复杂度：**O(1)

效果和 [[RedisClient.expire | EXPIRE]] 一样，区别是 PEXPIRE 的 ttl 是毫秒单位。

返回值含义：
- `1` ttl 设置成功。
- `0` key 不存在，设置失败。
