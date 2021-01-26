> - **Redis官方文档**：https://redis.io/commands/hscan
> - **起始版本**：2.8.0
> - **时间复杂度**：**每次调用的消耗为O(1)，完整迭代一次为 O(N)，包括足以使光标返回到 0 的命令调用。N 是集合内元素的数量。

详情参见 [[RedisGenericClient.scan | SCAN]] 命令。
