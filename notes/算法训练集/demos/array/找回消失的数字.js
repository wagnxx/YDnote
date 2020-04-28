/**
 * 
给定一个范围在  1 ≤ a[i] ≤ n ( n = 数组大小 ) 的 整型数组，数组中的元素一些出现了两次，另一些只出现一次。

找到所有在 [1, n] 范围之间没有出现在数组中的数字。

您能在不使用额外空间且时间复杂度为O(n)的情况下完成这个任务吗? 你可以假定返回的数组不算在额外空间内。

示例:

输入:
[4,3,2,7,8,2,3,1]

输出:
[5,6]
 */


/*
解题思路
 * 这个题目要求找出  1--nums.lenth 缺少的数
 * 举个例子:
 * int[] nums={2,3,1,4,4};
 * 这个完整的数组应该包含这些元素{1,2,3,4,5};
 * 所以nums它这个里面缺少5
 * 我们先看2，它的下标本来是1,所以把自己下标的元素（也就是数组nums的3）变成负的
 *  然后看3， 它的下标本来是2,所以把自己下标的元素（也就是数组nums的1）也变成负的
 *  然后是1， 它的下标本来是0,所以把自己下标的元素（也就是数组nums的0）也变成负的
 *  然后是4， 它的下标本来是3,所以把自己下标的元素（也就是数组nums的4）也变成负的
 *  然后是4， 它的下标本来是3,所以把自己下标的元素（也就是数组nums的4）也变成负的
 * 到最后这个数组下标为4的元素（也就是第二个4）还是正数，因为它缺少元素5来使它变成负的
 
 作者：2020-19-2
 链接：https://leetcode-cn.com/problems/find-all-numbers-disappeared-in-an-array/solution/ji-yu-guan-fang-fang-fa-er-de-xiang-xi-jiang-jie-b/
 // 来源：力扣（LeetCode）
 // 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 */




 //由于我和官方的第二个思路差不多，我就直接照搬官方代码，便于上面对于官方方法的讲解
// class Solution {
//     public List<Integer> findDisappearedNumbers(int[] nums) {
//         for(int i=0;i<nums.length;i++) {
// 			int newIndex = Math.abs(nums[i]) - 1;
// 			if(nums[newIndex] >= 0)
// 				nums[newIndex] *= -1;
// 		}
// 		List<Integer> list = new ArrayList<>();
// 		for(int i=1;i<=nums.length;i++) {
// 			if(nums[i-1]>0)
// 				list.add(i);
// 		}
// 		return list;
//     }
// }

// 作者：2020-19-2
// 链接：https://leetcode-cn.com/problems/find-all-numbers-disappeared-in-an-array/solution/ji-yu-guan-fang-fang-fa-er-de-xiang-xi-jiang-jie-b/
// 来源：力扣（LeetCode）
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


// 本题我在操作的时候遇到 测试[1,1] =》[2]，没明白意思。先不上自己的代码，思路是先排序，在reduce两两比较差值是否大于1