# math-calculater

一个可以用表达式进行计算的库，**不会丢失精度**

## Install

    npm i math-calculater --save

## Useage

    import {mixCalc} from 'math-calculater'
    const result = mixCalc('(price * num + price ) / num',{
        price:10,
        num:10
    })
    console.log(result) // 11

## Params

| param      | type   |                     example                     |
| ---------- | ------ | :---------------------------------------------: |
| expression | String | "( ( prize \* num + discount ) - cost ) / num " |
| variables  | Object | { prize:10 , num :5 ,discount : 1 , cost : 8 }  |

## Others

如果你只是需要简单计算，你可以导入其他三个计算的方法

    import { numSum,numMulti,numDiv } from 'math-calculater'
    let add = numSum(1,2) // 3
    let multi =  numMulti(2,2) // 4
    let div = numDiv(1,2) // 0.5  , 默认最多保留10位小数，如需更改，可通过传入第三个参数修改
