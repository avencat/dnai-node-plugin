// @flow
export default class Enum {
  getValue = (data: string, callback: Function) => {
    callback('ENUM.VALUE_GET');
  };

  removeValue = (data: string, callback: Function) => {
    callback('ENUM.VALUE_REMOVED');
  };

  setType = (data: string, callback: Function) => {
    callback('ENUM.TYPE_SET');
  };

  setValue = (data: string, callback: Function) => {
    callback('ENUM.VALUE_SET');
  };
}
