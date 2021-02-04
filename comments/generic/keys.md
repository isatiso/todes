> - **Redis官方文档**：https://redis.io/commands/keys
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N)，N 为当前库中 key 的个数。

查找匹配 pattern 的 key。

这个命令的时间复杂度是 O(N)，常量部分很小。举个例子，在一般入门级笔记本上，Redis 可以在 40 毫秒的时间内浏览 100 万个 key。

**警告：** 这是一个方便调试的命令，当你对一个庞大的库使用这个命令时，会导致性能极其低下。

支持的 glob 风格 patterns:

- `h?llo` 匹配 `hello`, `hallo` 和 `hxllo`。
- `h*llo` 匹配 `hllo` 和 `heeeello`。
- `h[ae]llo` 匹配 `hello`，`hallo`，但是 `hillo` 不行。
- `h[^e]llo` 匹配 `hallo`， `hbllo`，但是 `hello` 不行。
- `h[a-b]llo` 匹配 `hallo` 和 `hbllo`。

### 返回值

返回匹配 pattern 的字符串数组。

例子：

```typescript
await client.mset({ firstname: 'Jack', lastname: 'Stuntman', age: '35' })
// "OK"
await client.keys('*name*')
// ["lastname", "firstname"]
await client.keys('a??')
// ["age"]
await client.keys('*')
// ["lastname", "firstname", "age"]
```
