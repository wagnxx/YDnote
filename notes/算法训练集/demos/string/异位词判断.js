/**
 * 
给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。

示例 1:

输入: s = "anagram", t = "nagaram"
输出: true
示例 2:

输入: s = "rat", t = "car"
输出: false
说明:
你可以假设字符串只包含小写字母。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/valid-anagram
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。


方法一：排序
算法：
通过将 ss 的字母重新排列成 tt 来生成变位词。因此，如果 TT 是 SS 的变位词，对两个字符串进行排序将产生两个相同的字符串。此外，如果 ss 和 tt 的长度不同，tt 不能是 ss 的变位词，我们可以提前返回。

 

public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) {
        return false;
    }
    char[] str1 = s.toCharArray();
    char[] str2 = t.toCharArray();
    Arrays.sort(str1);
    Arrays.sort(str2);
    return Arrays.equals(str1, str2);
}
 

方法二：哈希表
算法：

为了检查 tt 是否是 ss 的重新排列，我们可以计算两个字符串中每个字母的出现次数并进行比较。因为 SS 和 TT 都只包含 A-ZA−Z 的字母，所以一个简单的 26 位计数器表就足够了。
我们需要两个计数器数表进行比较吗？实际上不是，因为我们可以用一个计数器表计算 ss 字母的频率，用 tt 减少计数器表中的每个字母的计数器，然后检查计数器是否回到零。

public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) {
        return false;
    }
    int[] counter = new int[26];
    for (int i = 0; i < s.length(); i++) {
        counter[s.charAt(i) - 'a']++;
        counter[t.charAt(i) - 'a']--;
    }
    for (int count : counter) {
        if (count != 0) {
            return false;
        }
    }
    return true;
}

 

 * 
 */



 // 本人js实现

 /**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
 
    if(s===t) return true;



    if(s.length!==t.length) return false;
 

    var sHash={}

    for(let i=0;i<s.length;i++){
        if(sHash[s.charAt(i)]!==undefined){
            sHash[s.charAt(i)]+=1
        }else{
             sHash[s.charAt(i)]=1;
        }
    }

     var tHash={};

         for(let i=0;i<t.length;i++){
        if(tHash[t.charAt(i)]!==undefined){
            tHash[t.charAt(i)]+=1
        }else{
             tHash[t.charAt(i)]=1;
        }
    }

    var tKeys=Object.keys(tHash);

    return tKeys.every(function(v){
        if(sHash[v]==undefined) return false;
        return tHash[v] === sHash[v];
    })




};