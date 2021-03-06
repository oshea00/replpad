/*jshint asi:true */
'use strict';

var test = require('trap').test
  , completeAppend = require('../lib/complete-append')
  , config = require('../config/current')

config.feed.format = {
    indent      :  { style: '  ', base: 0 }
  , quotes      :  'single'
  , json        :  false
  , renumber    :  false
  , hexadecimal :  false
  , escapeless  :  false
  , compact     :  true
  , parentheses :  false
  , semicolons  :  true
};

test('handles no history case', function (t) {
  var history = []
    , append = completeAppend(history)

  t.equal(append, null, 'returns null')
})

test('handles command only case', function (t) {
  var history = [' .append  ']
    , append = completeAppend(history)

  t.equal(append, null, 'returns null')
})

test('appends first expression before command', function (t) {
  var history = [
       '2 + 3'
    ,  'var a = true;'
    ,  '.append'
    ].reverse()
    , expected = '\nvar a = true;\n'
    , append = completeAppend(history)

    t.equal(append.raw, expected, 'gets raw')
    t.notEqual(append.raw, append.highlighted, 'gets highlighted')
})

test('appends multiline function before commands', function (t) {
  var history = [
      'function foo() {'
    ,  '  var a = 2;'
    ,  '  return a + 1;'
    ,  '}'
    ,  '   .clear '
    ,  '.append'
    ].reverse()

    , expected = '\nfunction foo() {\n  var a = 2;\n  return a + 1;\n}\n'
    , append = completeAppend(history)

    t.equal(append.raw, expected, 'gets raw')
    t.notEqual(append.raw, append.highlighted, 'gets highlighted')
})

test('completes 3 line function at end of history', function (t) {
  var history = [
      '1'
    , '2'
    , 'function foo() {'
    ,  '  var a = 2;'
    ,  '  return a + 1;'
    ,  '}'
    ].reverse()
    , expected = '\nfunction foo() {\n  var a = 2;\n  return a + 1;\n}\n'
    , append = completeAppend(history)

    t.equal(append.raw, expected, 'gets raw')
    t.notEqual(append.raw, append.highlighted, 'gets highlighted')
})

test('completes 3 line function at end of history that are badly formatted in a better formatted way', function (t) {
  var history = [
      '1'
    , '2'
    , 'function foo() {'
    ,  'var a = 2;'
    ,  '           return a + 1;'
    ,  '}'
    ].reverse()
    , expected = '\nfunction foo() {\n  var a = 2;\n  return a + 1;\n}\n'
    , append = completeAppend(history)

    t.equal(append.raw, expected, 'gets raw')
    t.notEqual(append.raw, append.highlighted, 'gets highlighted')
})

test('does not complete incomplete function at end of history', function (t) {
  var history = [
       '  var a = 2;'
    ,  '  return a + 1;'
    ,  '}'
    ].reverse()
    , expected = '\n}\n'
    , append = completeAppend(history)

    t.equal(append.raw, expected, 'gets raw')
    t.equal(append.raw, append.highlighted, 'does not highlight')
})

test('completes 2 + 3 at end of history', function (t) {
  var history = [
       '3 + 4'
    ,  '2 + 3'
    ].reverse()
    , expected = '\n2 + 3;\n'
    , append = completeAppend(history)

    t.equal(append.raw, expected, 'gets raw')
    t.notEqual(append.raw, append.highlighted, 'gets highlighted')
})

test('completes var a = true; at end of history with complete function right before', function (t) {
  var history = [
      'function foo () {'
    ,  '  var a = 2;'
    ,  '  return a + 1;'
    ,  '}'
    ,  'var a = true;'
    ].reverse()
    , expected = '\nvar a = true;\n'
    , append = completeAppend(history)

    t.equal(append.raw, expected, 'gets raw')
    t.notEqual(append.raw, append.highlighted, 'gets highlighted')
})

test('does not complete "var a =" at end of history with complete function right before', function (t) {
  var history = [
      'function foo () {'
    ,  '  var a = 2;'
    ,  '  return a + 1;'
    ,  '}'
    ,  'var a ='
    ].reverse()
    , expected = '\nvar a =\n'
    , append = completeAppend(history)

    t.equal(append.raw, expected, 'gets raw')
    t.equal(append.raw, append.highlighted, 'does not highlight')
})

test('completes 2 + 3 close to end whan .append is at end of history, thus ignoring .append', function (t) {
  var history = [
       '2 + 3'
    ,  '.append'
    ].reverse()
    , expected = '\n2 + 3;\n'
    , append = completeAppend(history)

    t.equal(append.raw, expected, 'gets raw')
    t.notEqual(append.raw, append.highlighted, 'gets highlighted')
})
