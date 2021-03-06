/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Arduino code generator for the IRremote library blocks.
 *     The Arduino IRremote library docs: https://www.arduinolibraries.info/libraries/i-rremote
 */
'use strict';

goog.provide('Blockly.Arduino.ir');

goog.require('Blockly.Arduino');

/**
 * Code generator to check if a IR signal got received at pin (X).
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['ir_check'] = function(block) {
  let pinKey = block.getFieldValue('IR_PIN');
  let irName = 'myIRrecv_' + pinKey;

  Blockly.Arduino.reservePin(
      block, pinKey, Blockly.Arduino.PinTypes.IR, 'IR Result');

  Blockly.Arduino.addInclude('irremote', '#include <IRremote.h>');
  Blockly.Arduino.addDeclaration('decode_results' + irName, 'decode_results results_' + pinKey + ';');
  Blockly.Arduino.addDeclaration('IRrecv_' + irName, 'IRrecv ' + irName + '(' + pinKey + ');');

  let setupCode = irName + '.enableIRIn();';
  Blockly.Arduino.addSetup(irName, setupCode, true);

  let code = irName + '.decode(&results_' + pinKey + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Code generator to read a IR signal from a pin (X).
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['ir_result'] = function(block) {
  var pinKey = block.getFieldValue('IR_PIN');
  var irName = 'myIRrecv_' + pinKey;

  Blockly.Arduino.reservePin(
      block, pinKey, Blockly.Arduino.PinTypes.IR, 'IR Result');

  Blockly.Arduino.addInclude('irremote', '#include <IRremote.h>');
  Blockly.Arduino.addDeclaration('decode_results' + irName, 'decode_results results_' + pinKey + ';');
  Blockly.Arduino.addDeclaration('IRrecv_' + irName, 'IRrecv ' + irName + '(' + pinKey + ');');

  Blockly.Arduino.userFunctions_['irreceive, getIR'] =
        'long getIR(IRrecv& irrecv, decode_results& results){\n' +
        '  long value;\n' +
        '  if (irrecv.decode(&results)) {\n' +
        '    value = results.value;\n' +
        '    irrecv.resume();\n' +
        '  } else {\n' +
        '    value = -1;\n' +
        '  }\n' +
        '  return value;\n' +
        '}';

  var setupCode = irName + '.enableIRIn();';
  Blockly.Arduino.addSetup(irName, setupCode, true);

  var code = 'getIR(' + irName + ', results_' + pinKey + ')';

  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
