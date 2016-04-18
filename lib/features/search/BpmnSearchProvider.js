'use strict';

var map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    sortBy = require('lodash/collection/sortBy');

var labelUtil = require('../label-editing/LabelUtil');


/**
 * Provides ability to search through BPMN elements
 */
function Search(elementRegistry, searchPad) {

  this._elementRegistry = elementRegistry;

  searchPad.registerProvider(this);
}

module.exports = Search;

Search._inject = [
  'elementRegistry',
  'searchPad'
];


/**
 * Finds all elements that match given pattern
 *
 * <Result> :
 *  {
 *    primaryTokens: <Array<Token>>,
 *    secondaryTokens: <Array<Token>>,
 *    element: <Element>
 *  }
 *
 * <Token> :
 *  {
 *    normal|matched: <String>
 *  }
 *
 * @param  {String} pattern
 * @return {Array<Result>}
 */
Search.prototype.find = function(pattern) {
  var elements = this._elementRegistry.filter(function(element) {
    if (element.labelTarget) {
      return false;
    }
    return true;
  });

  elements = map(elements, function(element) {
    return {
      primaryTokens: matchAndSplit(labelUtil.getLabel(element), pattern),
      secondaryTokens: matchAndSplit(element.id, pattern),
      element: element
    };
  });

  // exclude non-matched elements
  elements = filter(elements, function(element) {
    return hasMatched(element.primaryTokens) || hasMatched(element.secondaryTokens);
  });

  elements = sortBy(elements, function(element) {
    return labelUtil.getLabel(element.element) + element.element.id;
  });

  return elements;
};


function hasMatched(tokens) {
  var matched = filter(tokens, function(t){
    return !!t.matched;
  });

  return matched.length > 0;
}


function matchAndSplit(text, pattern) {
  var tokens = [],
      originalText = text;

  if (!text) {
    return tokens;
  }

  text = text.toLowerCase();
  pattern = pattern.toLowerCase();

  var i = text.indexOf(pattern);

  if (i > -1) {
    if (i !== 0) {
      tokens.push({
        normal: originalText.substr(0, i)
      });
    }

    tokens.push({
      matched: originalText.substr(i, pattern.length)
    });

    if (pattern.length + i < text.length) {
      tokens.push({
        normal: originalText.substr(pattern.length + i, text.length)
      });
    }
  } else {
    tokens.push({
      normal: originalText
    });
  }

  return tokens;
}