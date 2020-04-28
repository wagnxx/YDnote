/**
 * 
 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

示例:

输入: [0,1,0,3,12]
输出: [1,3,12,0,0]
说明:

必须在原数组上操作，不能拷贝额外的数组。
尽量减少操作次数。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/move-zeroes
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 * 
 * 
 * 
 * 
 */


 // 方法1 主要利用快慢指针移动
 var moveZeroes = function(nums) {
    for ( p = 0, i = 0; i < nums.length; i++) {
               if (nums[i] != 0) {
                   var temp = nums[i];
                   nums[i] = nums[p];
                   nums[p++] = temp;
               }
           }
   
       return nums
   };