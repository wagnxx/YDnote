### mysql 必记语句
1. 函数
> 常用函数有 count,min,max,sum,sqrt,rand,concat.

用法如下：
```
    // count
    select count(*) from ...
    // min
    select min(birthday) . t_student.* from ...
    //rand
    select rand()
```
2. where 语句
> (1)between  and/ > <,表示在一个开区间范围内的描述
```
    WHERE  price BETWEEN  20 AND 40 // 价格在[20,40]范围
    
```

> (2) like, 模糊查询（数据量大的时候慎用）
```
    WHERE name LIKE  '王%'
    WHERE name LIKE  '%六%'

```
> (3) order by ,默认asc，逆序为 desc

3. 复杂语句
```
    // WHERE
    SELECT t_student.id,t_student.name,t_class.class_name
    FROM t_student,t_class
    WHERE t_student.clas_id = t_class.class_id
    // LEFT JOIN
    SELECT t_student.id,t_student.name,t_class.class_name
    FROM t_student LEFT JOIN t_class
    ON t_student.clas_id = t_class.class_id

    //  where 更多的用于MySQL中，和 left join on 是等同的

```