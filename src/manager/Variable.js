// @flow
export default class Variable {
  getType = (data: string, callback: Function) => {
    callback('VARIABLE.TYPE_GET');
  };

  getValue = (data: string, callback: Function) => {
    callback('VARIABLE.VALUE_GET');
  };

  setType = (data: string, callback: Function) => {
    callback('VARIABLE.TYPE_SET');
  };

  setValue = (data: string, callback: Function) => {
    callback('VARIABLE.VALUE_SET');
  };
}
