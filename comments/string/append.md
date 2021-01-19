> - **Redis官方文档**：https://redis.io/commands/append
> - **起始版本**：2.0.0
> - **时间复杂度**：假设追加值很小，原始值为任意大小, 由于 Redis 使用的动态字符串会在每次重新分配时加倍字符串的存储空间，分摊时间复杂度为 O(1)。

返回追加后的字符串长度。

- 如果 key 不存在，则先创建为空字符串。
- 如果已经存在并且值类型为 string，此命令会追加 value 到值的结尾。
- 其他情况会抛出异常。

例子：

```typescript
await client.exists('mykey')
// 0
await client.append('mykey', 'Hello')
// 5
await client.append('mykey', ' World')
// 11
await client.get('mykey')
// "Hello World"
```
