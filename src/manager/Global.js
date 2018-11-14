// @flow
export default class Global {
  createProject = (data: string, callback: Function) => {
    callback('GLOBAL.PROJECT_CREATED');
  };

  removeProject = (data: string, callback: Function) => {
    callback('GLOBAL.PROJECT_REMOVED');
  };

  getProjectEntities = (data: string, callback: Function) => {
    callback('GLOBAL.PROJECT_ENTITIES_GET');
  };

  save = (data: string, callback: Function) => {
    callback('GLOBAL.SAVED');
  };

  load = (data: string, callback: Function) => {
    callback('GLOBAL.LOADED');
  };

  reset = (data: string, callback: Function) => {
    callback('GLOBAL.RESET_DONE');
  };
}
