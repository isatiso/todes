> - **Redis官方文档**：https://redis.io/commands/getrange
> - **起始版本**：2.4.0
> - **时间复杂度**：O(N)，N 是返回字符串的长度。
    > 复杂度最终取决于返回的长度，但是鉴于从现有字符串创建子串性能很好，所以对于小字符串可以认为复杂度为 O(1)。

返回指定 key 的字符串的子串。key 的类型如果不是 string 则抛出异常。

- 选取范围为闭区间 [start, end]。
- -1 表示最后一个元素，-2 为倒数第二个，以此类推。

**注意**：在 2.0.0 及更早的版本，命令名称为 SUBSTR。

例子：

```typescript
await client.set('myey', 'This is a string')
// "OK"
await client.getrange('mykey', 0, 3)
// "This"
await client.getrange('mykey', -3, -1)
// "ing"
await client.getrange('mykey', 0, -1)
// "This is a string"
await client.getrange('mykey', 10, 100)
// "string"
await client.getrange('mykey', 10, 100, true)
// <Buffer 73 74 72 69 6e 67>
```
