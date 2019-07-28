import {
    Student,
    Teacher,
    Classroom
} from './interfaces'

import {inject,injectable} from 'inversify'
import 'reflect-metadata';
import TYPES from './types'
@injectable()
class Xiaoming implements Student{
    public lear(){
        return '努力学习';
    }
}
@injectable()
class Zhijia implements Teacher{
    
    public teaching(){
        return '努力学习';
    }
}
@injectable()
class Yd implements Classroom{
    private _xiaoming:Student;
    private _zhijia:Teacher;
    constructor(@inject(TYPES.Student) xiaoming,
    @inject(TYPES.Teacher) zhijia){
        this._xiaoming=xiaoming;
        this._zhijia=zhijia;
    }
    public study(){
        return this._zhijia.teaching()+this._xiaoming.lear();
    }
}

export{
    Xiaoming,
    Zhijia,
    Yd
}