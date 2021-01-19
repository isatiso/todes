> - **起始版本：**2.8.0
> - **时间复杂度：**每次调用的消耗为O(1)，完整迭代一次为 O(N)，包括足以使光标返回到 0 的命令调用。N 是集合内元素的数量。

此命令用于增量迭代一个集合元素。

由于此命令为增量迭代方式，中途可能有元素被修改，所以无法保证完全的准确性。