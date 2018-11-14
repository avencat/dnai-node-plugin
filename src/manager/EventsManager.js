/* eslint-disable no-new-func */
import Declarator from './Declarator';
import Function from './Function';
import Variable from './Variable';
import Class from './Class';
import Enum from './Enum';
import List from './List';
import Global from './Global';
import Utils from '../utils/Utils';

export default class EventsManager {
  DECLARATOR = new Declarator();

  FUNCTION = new Function();

  VARIABLE = new Variable();

  CLASS = new Class();

  ENUM = new Enum();

  LIST = new List();

  GLOBAL = new Global();

  process = (eventType: string, event: string, data: string, callback: Function) => {
    const fullEventName = Utils.fromUnderscoreToCamelCase(event);
    const eventName = Utils.getFirstWord(fullEventName);

    if (!this[eventType] || typeof this[eventType][eventName] !== 'function') {
      return;
    }

    this[eventType][eventName](data, callback, Utils.getStringAfterFirstWord(fullEventName));
  };
}
