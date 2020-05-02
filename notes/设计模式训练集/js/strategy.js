// 策略模式
// 是准备一组算法，并将这组算法封装到一系列的策略里，作为一个策略的子类，策略模式的重心不是如何实现算法，而是如何组织这些算法，从而让程序结构更加灵活，具有更好的维护性和扩展性

/**
模式结构：
1.抽象策略 strategy类：定义一个公共接口，各个不同的算法以不同的方式实现这个接口，环境角色
使用这个接口调用不同的算法，一般使用接口或抽象类实现
2.具体策略 Concrete Strategy 类：实现了抽象策略定义的接口，提供具体的算法实现
3.环境 Context 类：持有一个策略类的引用，最终给客户端调用 


 */

// 抽象策略类


class Strategy{
    strategyMehod(){}
}

class ConcreteStrategyA extends Strategy{
    strategyMehod(){
        console.log('策略 A被访问')
    }
}
class ConcreteStrategyB extends Strategy{
    strategyMehod(){
        console.log('策略 B被访问')
    }
}

class Context{
    constructor(){
        this.strategy=null;
    }

    setStratege(s){
        this.strategy=s;
    }

    strategyMehod(){
        this.strategy.strategyMehod();
    }

}

function test(){
    var c=new Context();
    var s=new ConcreteStrategyA();
    c.setStratege(s);
    c.strategyMehod();
    console.log('===============');
    s=new ConcreteStrategyB();
    c.setStratege(s);
    c.strategyMehod();
}


// java版pattern

/**
 * 
 
package strategy;
public class StrategyPattern
{
    public static void main(String[] args)
    {
        Context c=new Context();
        Strategy s=new ConcreteStrategyA();
        c.setStrategy(s);
        c.strategyMethod();
        System.out.println("-----------------");
        s=new ConcreteStrategyB();
        c.setStrategy(s);
        c.strategyMethod();
    }
}
//抽象策略类
interface Strategy
{   
    public void strategyMethod();    //策略方法
}
//具体策略类A
class ConcreteStrategyA implements Strategy
{
    public void strategyMethod()
    {
        System.out.println("具体策略A的策略方法被访问！");
    }
}
//具体策略类B
class ConcreteStrategyB implements Strategy
{
  public void strategyMethod()
  {
      System.out.println("具体策略B的策略方法被访问！");
  }
}
//环境类
class Context
{
    private Strategy strategy;
    public Strategy getStrategy()
    {
        return strategy;
    }
    public void setStrategy(Strategy strategy)
    {
        this.strategy=strategy;
    }
    public void strategyMethod()
    {
        strategy.strategyMethod();
    }
}





 */