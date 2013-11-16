module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the absolute value of a value.
   *
   *     abs(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.abs = function abs(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('abs', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.abs(x);
    }

    if (isComplex(x)) {
      return Math.sqrt(x.re * x.re + x.im * x.im);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, abs);
    }

    throw new util.error.UnsupportedTypeError('abs', x);
  };
};