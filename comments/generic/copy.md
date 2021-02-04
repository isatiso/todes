> - **Redis官方文档**：https://redis.io/commands/copy
> - **起始版本**：6.2.0
> - **时间复杂度**：对于 string 类型是 O(1), 对于集合类型的值为 O(N), N 为嵌套元素个数。

将 source 的值复制到 destination。

默认情况下，destination 会创建在连接当前所持有的逻辑 database 上。通过 db 选项，可以指定需要创建在哪个逻辑 database。

当 destination 已经存在的情况下，COPY 命令会返回一个错误。可以通过 replace 选项移除原来的 destination。

### 返回值

- `0` 复制失败。
- `1` 复制成功。

例子：

```typescript
await client.set('dolly', 'sheep')
// "OK"
await client.copy('dolly', 'clone')
// 1
await client.get('clone')
// "sheep"
```
