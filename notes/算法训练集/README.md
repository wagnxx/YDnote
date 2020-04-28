# 算法总结

> 这部分内容主要总结算法基础，和解题思路，demol里含经典算法案例；整个算法离不开数据结构，或多或少也会总结点数据结构相关知识

### 基础部分
1. 通常从哪几方面考量一个算法？
- 时间，空间 复杂度
- 正确性
- 可读性
- 健壮性

2. 算法有哪些特征？
- 有穷性，有限的步骤完成
- 确切性，每一步有确切的意义
- 输入性，至少有0项输入
- 输出性，至少有一项输出
- 可行性（有效性）  

3. 栈和队列两种数据结构的特征？
- 相同点，都属于线性表，是由链表或者数组实现，都具有新增，删除，修改，查找的功能

- 不同点
    + 对于栈，它是先进后出（FILO）,只能从栈顶的一端像栈底方向入栈，也只能从栈顶到栈底的顺序依次出栈
    + 对于队列，它是遵循先进先出（FIFO）原则，从对尾向对首方向入队，由对首向对尾方向依次出队，当然优先队列除外

4. 线性表的基本操作有哪些?
- 初始化，创建
- 插入 
- 删除指定节点
- 修改指定节点数据
- 查找指定节点
- 清空链表


5. 简述散列表的特点和用途？
- 散列表也叫哈斯表，是一种查找算法，与链表，树不同的是散列表在查找时不需要一系列和关键字比较的操作
- 根据给定的散列函数和处理冲突的方法，将一组关键字key映射到有限的地址空间上，并以地址区间中的像作为数据元素表的存储位置，
这种表便称为散列表，这个映射过程称为散列，存储位置称为散列地址


6. 冒泡排序和选择排序的优缺点
- 冒泡排序是稳定的排序，选择排序是非稳定的
- 冒泡排序需要开辟新的内存空间以提高交换操作，交换次数越多效率越低
- 选择排序相对冒泡排序交换次数少，因此效率较高

7. 编程实战，请编写该数组中查找元素的最佳方案：[2,3,5,7,11,13,17,19,23,29,31,37,47,43,47]中查找 37

- 使用二分法查找方案

```js
    function find(arr,item){
        var low=0;
        var heigh=arr.length-1;
        
        while(low<heigh){
            var mid=Math.floor((low+heigh)/2);
            if(arr[mid]>item){
                heigh=mid;
            }else if(arr[mid]<item){
                low=mid
            }else{
                return mid;
            }
        }
        return -1;
    }

```




8. 请写出单向链表和双向链表的添加和删除操作的主要代码

- 单向链表的 --添加-- 和 --删除--
```js
    function insert(newEl,item){
        var newNode= this.createNode(newEl);
        var current=this.find(item);

        newNode.next=current.next
        current.next=newNode;
    }


    function remove(item){
        var current=this.find(item);
        var prevNode=this.findPrev(item);

        if(prevNode.next!==null){

            preveNode.next=current.next;
            current.next=null
        }
    }


```

- 双向链表的 --添加-- 和 --删除--

```js
    function insert(newEl,item){
        var newNode=this.createNode(newEl);
        var current = this.find(item);

        newNode.next=current.next;
        newNode.previous=current;

        current.next=newNode;

        if(newNode.next!==null){

            newNode.next.previous=newNode;
        }
  
    }



    function remove(item){
        var current = this.find(item);
        current.previou.next=current.next;
        if(current.next!==null){
            current.next.previou=current.previous;
              current.next=null;
              current.prevous=null;
        }else{
            current.previous.next=null;
            current.prevous=null;
        }

      
    }

```

9.  请用代码实现二叉搜索树，并实现相关方式查找最小值

```js
    function Node(data,left,right){
        this.data=data;
        this.left=left;
        this.right=right;
    }

    function insert(data){
        var n=new Node(data,null,null);
        if(this.root===null){
            this.root=n;
        }else{
            var current=this.root;
            var parent;
            while(true){
                parent = current;

                if(data<current.data){
                    current = current.left;
                    if(current==null){
                        parent.left=n;
                        break;
                    }
                }else{
                    current = current.right;
                    parent.right=n;
                    break;
                }
            }
        }
    }

    function getSmallest(root){
        var current = this.root || root;

        while(!(current.left == null)){
            current = current.left;

        }
        return current;
    }


```