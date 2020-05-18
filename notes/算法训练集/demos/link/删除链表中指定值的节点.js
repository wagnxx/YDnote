/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var deleteNode = function(head, val) {
 
    let h = {};
    h.next = head;

    let cur = h;

    while(cur && cur.next){
        let next = cur.next;
        if(next.val === val){
            cur.next = next.next;
            break;
        } 
        cur = next;
        
    }





    return h.next;


};