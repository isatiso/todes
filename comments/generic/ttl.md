> - **起始版本：**2.6.0
> - **时间复杂度：**O(1)

返回查询的值的剩余有效毫秒数。

- 如果 key 不存在，2.8 及之后的版本返回 -2， 更早的版本返回 -1。
- 如果 key 存在且未设置 ttl 则返回 -1。