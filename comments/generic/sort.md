> - **Redis官方文档**：https://redis.io/commands/sort
> - **起始版本**：1.0.0
> - **时间复杂度**：O(N + M * log(M)) 其中 N 是要排序的元素的数量，M 是返回的元素的数量。 如果不对元素进行排序，则当前的复杂度为 O(N)，在下一版本中将避免复制步骤。

返回或者存储集合类型的值的成员排序结果。
集合类型是值 list set zset 这种包含多个成员的类型。
默认情况下排序是数字形式的比较，成员名会被解释为一个双精度浮点数。

假设 mylist 是一个数字列表，此命令将返回与 mylist 相同的列表，从小到大排序。如果需要逆序，可以使用 desc 选项。

`await client.sort('mylist', { desc: true })`

假设 mylist 是一个字符串列表，你需要让他们按照字典序排列，可以使用 alpha 选项。

`await client.sort('mylist', { alpha: true })`

如果你正确设置了 `!LC_COLLATE` 环境变量，Redis 可以识别 UTF-8 编码。

通过使用 limit 选项，可以限制返回的成员数量。格式为 `limit: [offset, count]`，offset 表示要跳过的元素个数，count 表示需要返回的元素个数。

`await client.sort('mylist', { limit: [0, 10] })`

上述各个选项可以同时使用，下面的例子表示，按照字典序倒序排列，取前 5 个。

`await client.sort('mylist', { limit: [0, 5], desc: true, alpha: true })`

### 通过外部键排序

又是你希望通过外部的 key 的值替代实际成员的值作为权重进行排序。
比如说列表 `mylist` 包含了元素 `1, 2, 3`，代表对象 `object_1`，`object_2`，`object_3` 的唯一 ID。
当这些对象的权重存储在 `weight_1`，`weight_2`，`weight_3` 的时候，SORT 命令可以利用这些权重对 `mylist` 进行排序。

`await client.sort('mylist', { by: 'weight_*' })`

`by` 选项接收一个 pattern 格式（在这个例子中是 `weight_*`），用来生成需要排序的 key。通过将列表中的实际成员值替换，首次出现的 `*`，得到需要使用的 key。

### 跳过排序

`by` 选项也可以接受一个不存在的 key，这会导致 SORT 命令跳过排序操作。当你只需要提取外部 key（参考下面的 get 选项），而不需要排序时很有用。

`await client.sort('mylist', { by: 'nosort' })`

### 获取外部 key

上一个例子中只是返回了排好序的 ID 列表。在一些场景中，获取实际的对象比只获取 ID 更有用。
通过使用 `get` 选项可以修改返回值为外部 key 的值。

`await client.sort('mylist', { by: 'weight_*', get: ['object_*'] })`

`get` 选项可以包含多组数据。在使用 `get` 选项的同时如果也需要返回本身的值，可以使用 `#`。

`await client.sort('mylist', { by: 'weight_*', get: ['object_*', '#'] })`

### 将 sort 的结果存储到其他的 key

默认情况下，sort 会返回排序结果。使用 `store` 参数可以将结果存储到指定的 key。

`await client.sort('mylist', 'resultkey', { by: 'weight_*' })`

一个有趣的使用场景是，将排序结果存储到其他 key 之后，设置过期时间。这样就不用对每个请求执行排序了。当过期之后，通过再次调用排序命令生成新的排序结果。

### 对 by 和 get 选项使用哈希表

在 `by` 和 `get` 选项可以指定哈希表的字段。语法如下：

`await client.sort('mylist', { by: 'weight_*->fieldname', get: ['object_*->fieldname'] })`

字符串 `->` 用于分割 key 和 hash field。key 的值会如上文所述进行替换，之后获取 hash 中的指定 field。

### 返回值

- 不传递 store 参数，列表形式返回排序结果。
- 传递 store 参数，返回存储到 destination 的列表长度。
