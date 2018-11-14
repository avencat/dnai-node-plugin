// @flow
export default class Class {
  addAttribute = (data: string, callback: Function) => {
    callback('CLASS.ATTRIBUTE_ADDED');
  };

  removeAttribute = (data: string, callback: Function) => {
    callback('CLASS.ATTRIBUTE_REMOVED');
  };

  renameAttribute = (data: string, callback: Function) => {
    callback('CLASS.ATTRIBUTE_RENAMED');
  };

  setFunctionAsMember = (data: string, callback: Function) => {
    callback('CLASS.FUNCTION_SET_AS_MEMBER');
  };
}
