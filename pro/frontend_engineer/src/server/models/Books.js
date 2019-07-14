
/**
 * @fileoverview 实现books 数据模型
 * @author wang
 * 
 */
const SafeRequest = require('../utils/SafeRequest')
class Books{
    /**
     * Books 类 获取后台books相关数据
     */

     /**
      * @constructor
      * @param {object} app 执行上下文
      */
     constructor(app){
        this.app = app;
     }

     /**
      * 获取后台全部图书列表
      * @param {*} optins 配置项
      * @example
      * 
      */

     getData(optins){
         const safeRequest = new SafeRequest('books/index');

         return safeRequest.fetch();
     }

}

 export default Books;