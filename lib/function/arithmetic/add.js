module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isBoolean = util.boolean.isBoolean,
      isNumber = util.number.isNumber,
      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Add two values
   *
   *     x + y
   *     add(x, y)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} y
   * @return {Number | BigNumber | Complex | Unit | String | Array | Matrix} res
   */
  math.add = function add(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('add', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        // number + number
        return x + y;
      }
      else if (isComplex(y)) {
        // number + complex
        return new Complex(
            x + y.re,
            y.im
        )
      }
    }
    else if (isComplex(x)) {
      if (isNumBool(y)) {
        // complex + number
        return new Complex(
            x.re + y,
            x.im
        )
      }
      else if (isComplex(y)) {
        // complex + complex
        return new Complex(
            x.re + y.re,
            x.im + y.im
        );
      }
    }
    else if (isUnit(x)) {
      if (isUnit(y)) {
        if (!x.equalBase(y)) {
          throw new Error('Units do not match');
        }

        if (x.value == null) {
          throw new Error('Unit on left hand side of operator + has an undefined value');
        }

        if (y.value == null) {
          throw new Error('Unit on right hand side of operator + has an undefined value');
        }

        var res = x.clone();
        res.value += y.value;
        res.fixPrefix = false;
        return res;
      }
    }

    if (x instanceof BigNumber) {
      if (y instanceof BigNumber || isNumber(y)) {
        return x.plus(y);
      }
      else if (isBoolean(y)) {
        return x.plus(Number(y));
      }
    }
    else if (y instanceof BigNumber) {
      if (isNumber(x)) {
        return y.plus(x);
      }
      else if (isBoolean(x)) {
        return y.plus(Number(x));
      }
    }

    if (isString(x) || isString(y)) {
      return x + y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, add);
    }

    throw new util.error.UnsupportedTypeError('add', x, y);
  };
};