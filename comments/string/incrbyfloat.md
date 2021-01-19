> - **Redis官方文档**：https://redis.io/commands/incrbyfloat
> - **起始版本**：2.6.0
> - **时间复杂度**：O(1)

将 key 处存储的浮点数增加 increment。

- 如果 increment 传递负值，则效果是减小。
- INCRBYFLOAT 的返回格式是字符串，基于保持输入输出一致以及避免精度损失。这里的 increment 使用字符串形式。
- 如果 key 不存在，先将 key 设为 0。
- 如果 key 对应的值不能解析为数字或者压根不是 string，将抛出异常。

当命令执行成功，则将递增后的新值存储到 key 上（替换旧的值），并以字符串形式返回新的值。

key 值以及提供的增量（increment）都可以使用指数表示法，但是计算后的结果始终使用小数形式，且后缀的 0 始终会被清除。

```typescript
client.set('mykey', '10.50')            // "OK"
client.incrbyfloat('mykey', '0.1')      // "10.6"
client.incrbyfloat('mykey', '-5')       // "5.6"
client.set('mykey', '5.0e3')            // "OK"
client.incrbyfloat('mykey', '2.0e2')    // "5200
```
