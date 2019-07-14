class Index{
    constructor(str){
        this.str=str;
    }
    say(){
        return this.str;
    }
}

const index = new Index('xxx');
index.say();
export default Index;