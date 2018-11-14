// @flow
import Utils from '../utils/Utils';

export default class Function {
  call = (data: string, callback: Function) => {
    callback('FUNCTION.CALLED');
  };

  addInstruction = (data: string, callback: Function) => {
    callback('FUNCTION.INSTRUCTION_ADDED');
  };

  removeInstruction = (data: string, callback: Function) => {
    callback('FUNCTION.INSTRUCTION_REMOVED');
  };

  setEntryPoint = (data: string, callback: Function) => {
    callback('FUNCTION.ENTRY_POINT_SET');
  };

  setParameter = (data: string, callback: Function) => {
    callback('FUNCTION.PARAMETER_SET');
  };

  setReturn = (data: string, callback: Function) => {
    callback('FUNCTION.RETURN_SET');
  };

  instruction = (data: string, callback: Function, event: string) => {
    this[`instruction${Utils.firstLetterToUpperCase(event)}`](data, callback);
  };

  instructionLinkData = (data: string, callback: Function) => {
    callback('FUNCTION.INSTRUCTION.DATA_LINKED');
  };

  instructionLinkExecution = (data: string, callback: Function) => {
    callback('FUNCTION.INSTRUCTION.EXECUTION_LINKED');
  };

  instructionUnlinkExecution = (data: string, callback: Function) => {
    callback('FUNCTION.INSTRUCTION.EXECUTION_UNLINKED');
  };

  instructionSetInputValue = (data: string, callback: Function) => {
    callback('FUNCTION.INSTRUCTION.INPUT_VALUE_SET');
  };

  instructionUnlinkData = (data: string, callback: Function) => {
    callback('FUNCTION.INSTRUCTION.DATA_UNLINKED');
  };
}
