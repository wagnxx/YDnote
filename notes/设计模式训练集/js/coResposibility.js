 class  Player{
    constructor(successor){
        this.successor=successor;
    }
    handle(i){}

    next(index){
        if(this.successor!==null){
            this.successor.handle(index);
        }else{
            console.log('游戏结束')
        }
    }


}

class PlayerA extends Player{
    // constructor(...arg){
    //     super(arg)
    // }
    handle(i){
        if(i===1){
            console.log('player A 喝酒')
        }else{
            console.log('player A 向下传递')
            this.next(i);
        }
    }
}
class PlayerB extends Player{
    // constructor(...arg){
    //     super(arg)
    // }
    handle(i){
        if(i===2){
            console.log('player B 喝酒')
        }else{
            console.log('player B 向下传递')
            this.next(i);
        }
    }
}
class PlayerC extends Player{
    // constructor(...arg){
    //     super(arg)
    // }
    handle(i){
        if(i===3){
            console.log('player C 喝酒')
        }else{
            console.log('player C 向下传递')
            this.next(i);
        }
    }
}
class PlayerD extends Player{
    // constructor(...arg){
    //     super(arg)
    // }
    handle(i){
        if(i===4){
            console.log('player D 喝酒')
        }else{
            console.log('player D 向下传递')
            this.next(i);
        }
    }
}

function test(){
    playerD = new PlayerD(null);
    playerC = new PlayerC(playerD);
    playerB = new PlayerB(playerC);
    playerA = new PlayerA(playerB);


    playerA.handle(3);
}


/**
 * 
 * 
 核心就是 handle 和 next方法
1. handle是每一个对象私有的
2. next是共有的


package com.pattern.demo.cOResponsibility;

public abstract class Player {
    // 具体传话的人
    private Player successor;

    //传入下一个具体的传话人
    protected void setSuccessor(Player successor){
        this.successor=successor;
    }

    //传递过程
    public abstract void handle(int i);

    // 传递给下一个
    public void next(int index){
        if(successor!=null){
            successor.handle(index);
        }else {
            System.out.println("游戏结束");
        }
    }
}









 * 
 * 
 * 
 * 
 */