/* eslint-disable no-new-func */
import AI from './AI';
import Enum from './Enum';
import List from './List';
import Class from './Class';
import Global from './Global';
import Function from './Function';
import Variable from './Variable';
import Utils from '../utils/Utils';
import Declarator from './Declarator';

export default class EventsManager {
  CLASS = new Class();

  DECLARATOR = new Declarator();

  ENUM = new Enum();

  FUNCTION = new Function();

  GLOBAL = new Global();

  LIST = new List();

  VARIABLE = new Variable();

  process = (eventType: string, event: string, data: string, sendEvent: Function, AIArray: Array<AI>) => {
    const fullEventName = Utils.fromUnderscoreToCamelCase(event);
    const eventName = Utils.getFirstWord(fullEventName);

    if (!this[eventType] || typeof this[eventType][eventName] !== 'function') {
      return;
    }

    if (eventType === 'FUNCTION' && eventName === 'instruction') {
      this.FUNCTION.instruction(data, Utils.getStringAfterFirstWord(fullEventName), AIArray);
    } else {
      this[eventType][eventName](data, AIArray);
    }
  };
}
