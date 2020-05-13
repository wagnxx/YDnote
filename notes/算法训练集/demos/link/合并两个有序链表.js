/**

21. 合并两个有序链表
将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

示例：

输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4


*/



/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

 // 方法一：递归
 var mergeTwoLists = function(l1, l2) {
    if(l1 == null) return l2;

    if(l2 == null) return l1;

    if(l1.val<l2.val){
        l1.next = mergeTwoLists(l1.next,l2)
        return l1;
    }else{
        l2.next = mergeTwoLists(l2.next,l1);
        return l2;
    }
};


// 方法二

// class Solution {
//     public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
//         ListNode prehead = new ListNode(-1);

//         ListNode prev = prehead;
//         while (l1 != null && l2 != null) {
//             if (l1.val <= l2.val) {
//                 prev.next = l1;
//                 l1 = l1.next;
//             } else {
//                 prev.next = l2;
//                 l2 = l2.next;
//             }
//             prev = prev.next;
//         }

//         // 合并后 l1 和 l2 最多只有一个还未被合并完，我们直接将链表末尾指向未合并完的链表即可
//         prev.next = l1 == null ? l2 : l1;

//         return prehead.next;
//     }
// }

// 作者：LeetCode-Solution
// 链接：https://leetcode-cn.com/problems/merge-two-sorted-lists/solution/he-bing-liang-ge-you-xu-lian-biao-by-leetcode-solu/
// 来源：力扣（LeetCode）
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。