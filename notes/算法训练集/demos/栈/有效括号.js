/**
20. 有效的括号

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
注意空字符串可被认为是有效字符串。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/valid-parentheses
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



*/

/**
 * @param {string} s
 * @return {boolean}
 */
 var isValid = function(s) {

    let len = s.length;

    if(len % 2!==0) return false;

    let allTags={
        '(':{name:'little',type:'enter'},
        ')':{name:'little',type:'out'},
        '[':{name:'middle',type:'enter'},
        ']':{name:'middle',type:'out'},
        '{':{name:'bigger',type:'enter'},
        '}':{name:'bigger',type:'out'},
    }   

    let hashObj={
        little:{enter:'(',out:')',n:0,},
        middle:{enter:'[',out:']',n:0},
        bigger:{enter:'{',out:'}',n:0}
    };



    let stack=[];

    for(let i=0;i<len;i++){
        let cur = s[i];

        // if(!allTags[cur]) return false;

        let name = allTags[cur].name;
        let type = allTags[cur].type;

        if(type==='enter'){
            stack.push(cur);
        }

        if(type === 'out'){
            let pop=stack.pop();
            if(pop===hashObj[name]['enter']){

            }else{
                return false;
            }
        }

    }

    return stack.length == 0;



};