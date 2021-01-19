> - **起始版本：**1.2.0
> - **时间复杂度：**O(1)

效果和 [[RedisClient.expire | EXPIRE]] 一样，区别是 EXPIREAT 的超时参数是时间戳形式。

返回值含义：
- `1`：ttl 设置成功。
- `0`：key 不存在，设置失败。