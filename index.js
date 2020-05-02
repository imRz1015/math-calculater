/**
 * CREATED BY TANGIMING
 * 2020-05-02
 */

/**
 * 返回一个数字的精度值
 * @param num 数字
 */
function getPrecision(num) {
  if (isNaN(num)) {
    throw new Error(`${num} 不是一个数字`);
  }
  if (num.toString().includes(".")) {
    return num.toString().split(".")[1].length;
  } else {
    return 0;
  }
}
/**
 * 加法
 * @param num1 第一个数字
 * @param num2 第二个数字
 * @returns {number} 计算结果
 */
export function numSum(num1, num2) {
  let baseNum, baseNum1, baseNum2;
  baseNum1 = getPrecision(num1);
  baseNum2 = getPrecision(num2);
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  return Number(num1 * baseNum + num2 * baseNum) / baseNum;
}
/**
 * 乘法
 * @param num1 第一个数字
 * @param num2 第二个数字
 * @returns {number} 计算结果
 */
export function numMulti(num1, num2) {
  let baseNum = 0;
  baseNum += getPrecision(num1);
  baseNum += getPrecision(num2);
  return (
    (Number(num1.toString().replace(".", "")) *
      Number(num2.toString().replace(".", ""))) /
    Math.pow(10, baseNum)
  );
}
/**
 * 除法
 * @param num1 第一个数字
 * @param num2 第二个数字
 * @param precision 计算精度
 * @returns {number} 计算结果
 */
export function numDiv(num1, num2, precision = 10) {
  let baseNum1 = 0,
    baseNum2 = 0;
  let baseNum3, baseNum4;
  baseNum1 = getPrecision(num1);
  baseNum2 = getPrecision(num2);
  baseNum3 = Number(num1.toString().replace(".", ""));
  baseNum4 = Number(num2.toString().replace(".", ""));
  return Number(
    ((baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1)).toFixed(
      precision
    )
  );
}

/**
 * 用于进行表达式的计算(综合混合计算式)
 * 计算结果是精确的,不丢失精度
 * @param expression 需要计算的表达式
 * @param variables 表达式中包含的变量对应的值
 * @returns {number} 计算的结果
 *
 * eg.  mixCalc("a/b-(c+d)*e", {
 *          a:10,b:5,c:4,d:6,e:2
 *      });
 * 则返回结果就是(10/5-(-4+6)*2=-2)
 */
export function mixCalc(expression, variables) {
  // 去掉表达式中的换行和空格
  expression = expression.replace(/[ \r\n]+/g, "");
  // 减号一律替换为加减号(避免复数的错误读取)
  expression = expression.replace(/-/g, "+-");
  // 多个加号相连一律变为一个加号
  expression = expression.replace(/\++/g, "+");
  // 通过正则表达式取出表达式中的变量
  let variable = expression.match(/[A-Za-z_][A-Za-z0-9_]*/);
  while (variable) {
    // 表达式中的变量未被定义时抛出异常
    let variableName = variable[0];
    let variableValue = variables[variableName];
    if (variableValue === undefined) {
      throw new Error("表达式中的变量 " + variableName + " 没有被定义!");
    }
    // 将表达式中的变量替换为其对应的值
    expression = expression.replace(variableName, variableValue);
    // 匹配表达式中是否还存在有未替换的变量
    variable = expression.match(/[A-Za-z_][A-Za-z0-9_]*/);
  }

  // 两个减号相连一律变为加号
  expression = expression.replace(/\+*--/g, "+");
  // 多个加号相连一律变为一个加号
  expression = expression.replace(/\++/g, "+");

  // 通过正则表达式取出优先级最高的括号及其中的内容
  let block = expression.match(/\([^\(\)]*\)/);
  // 当表达式中有括号时循环计算每个括号中的值
  while (block) {
    // 去掉字串中的括号
    let blockInner = block[0].substr(1, block[0].length - 2);
    // 作为一个新的表达式进行递归计算,将计算结果替换括号的位置
    expression = expression.replace(block[0], mixCalc(blockInner, variables));
    // 匹配表达式中是否还有括号
    block = expression.match(/\([^\(\)]*\)/);
  }
  // 通过正则表达式取出除法表达式
  let divExpression = expression.match(/\-?\d+\.?\d*\/\-?\d+\.?\d*/);
  let operationNum; // 预定义一个操作数
  // 当表达式中有除法时循环计算每个除法表达式的值
  while (divExpression) {
    // 取出除数和被除数
    operationNum = divExpression[0].split("/");
    // 进行除法计算,将计算结果替换原来出发表达式的位置
    expression = expression.replace(
      divExpression,
      numDiv(operationNum[0], operationNum[1], 10)
    );
    // 匹配表达式中是否还有除法
    divExpression = expression.match(/\-?\d+\.?\d*\/\-?\d+\.?\d*/);
  }
  // 计算乘法
  let multiExpression = expression.match(/\-?\d+\.?\d*\*\-?\d+\.?\d*/);
  while (multiExpression) {
    operationNum = multiExpression[0].split("*");
    expression = expression.replace(
      multiExpression,
      numMulti(operationNum[0], operationNum[1])
    );
    multiExpression = expression.match(/\-?\d+\.?\d*\*\-?\d+\.?\d*/);
  }
  // 计算加法
  let sumExpression = expression.match(/\-?\d+\.?\d*\+\-?\d+\.?\d*/);
  while (sumExpression) {
    operationNum = sumExpression[0].split("+");
    expression = expression.replace(
      sumExpression,
      numSum(operationNum[0], operationNum[1])
    );
    sumExpression = expression.match(/\-?\d+\.?\d*\+\-?\d+\.?\d*/);
  }

  // 所有加号去掉,所有相连的两个减号去掉
  expression = expression.replace(/\+/g, "");
  expression = expression.replace(/--/g, "");
  return Number(expression);
}
