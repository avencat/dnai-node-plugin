// @flow
export default class Declarator {
  declare = (data: string, callback: Function) => {
    callback('DECLARATOR.DECLARED');
  };

  move = (data: string, callback: Function) => {
    callback('DECLARATOR.MOVED');
  };

  remove = (data: string, callback: Function) => {
    callback('DECLARATOR.REMOVED');
  };

  rename = (data: string, callback: Function) => {
    callback('DECLARATOR.RENAMED');
  };

  setVisibility = (data: string, callback: Function) => {
    callback('DECLARATOR.VISIBILITY_SET');
  };
}
