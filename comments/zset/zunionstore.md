> - **Redis官方文档**：https://redis.io/commands/zunionstore
> - **起始版本**：2.0.0
> - **时间复杂度**：O(N)+O(M*log(M)) N 是全部输入集的大小的和，M 是结果集的大小。

计算给定的排序集的并集，并将结果存入 destination 中。

结果集中成员的分数，默认是该成员在所有输入排序集中的分数的和。

使用 weights 选项可以设置输入集的权重因子。意思是输入集中的元素传递给聚合函数前会先乘以对应的权重。

使用 aggregate 选项可以指定结果集中的 score 计算方式。默认是 'SUM' 也就是求和，可以更改为 'MIN' 或者 'MAX' 分别表示取最小值和最大值。

如果 destination 已经存在则会被重写。

### 返回值，

例子：

```typescript
await client.zadd('zset1', { one: 1, two: 2 })
// 2
await client.zadd('zset2', { one: 1, two: 2, three: 3 })
// 3
await client.zunionstore('out', ['zset1', 'zset2'], { weights: [2, 3] })
// 3
await client.zrange('out', { min: 0, max: -1 }, true)
// ["one", "5", "three", "9", "two", "10"]
```
