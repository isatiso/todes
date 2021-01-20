> - **Redis官方文档**：https://redis.io/commands/setrange
> - **起始版本**：2.2.0
> - **时间复杂度**：不考虑复制新字符串花费的时间的话复杂度是 O(1)。
    > 通常这个字符串很小，所以基本上可以认为复杂度就是 O(1)。否则的话，复杂度是 O(M) M 是参数字符串的长度。

部分重写 key 对应的值。从指定的 offset 开始，写入新的值。返回修改后的字符串长度。

- 如果 offset 超过了原字符串的长度，则超过的部分会补充 `\0`，之后填充新的 value。
- key 不存在会先设置为空字符串。

**注意**：当 offset 很大，而原字符串不存在或者很小，此时引起的 Redis 重新分配内存耗时会比较大。 具体数据参见 [[RedisClient.setbit | SETBIT]] 命令。

例子：

```typescript
await client.set('key1', 'Hello World')
// "OK"
await client.setrange('key1', 6, 'Redis')
// 11
await client.get('key1')
// "Hello Redis"
await client.setrange('key2', 6, 'Redis')
// 11
await client.get('key2')
// "\0\0\0\0\0\0Redis"
```
