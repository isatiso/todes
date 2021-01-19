> - **Redis官方文档**：https://redis.io/commands/getrange
> - **起始版本**：2.4.0
> - **时间复杂度**：O(1)

返回指定 key 的字符串的子串。key 的类型如果不是 string 则抛出异常。

- 选取范围为闭区间 [start, end]。
- -1 表示最后一个元素，-2 为倒数第二个，以此类推。

**注意**：在 2.0.0 及更早的版本，命令名称为 SUBSTR。
