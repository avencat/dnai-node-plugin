// @flow
import { ENTITY_TYPE_ENUM } from '../serverCommunication/Enums';
import AI from './AI';
import Utils from '../utils/Utils';

type EntityGetData = {
  data: {
    sent: {
      EntityId: number,
    },
    response: {
      Entity: {
        Type: number,
        Name: string,
        Id: number,
        Visibility: number,
      },
    },
  },
};

type LoadedData = {
  data: {
    response: {
      Projects: Array<number>,
    },
  },
};

export default class Global {
  loaded = ({ data }: LoadedData, sendEvent: Function, AIArray: Array<AI>) =>
    new Promise((resolve) => {
      data.response.Projects.forEach(EntityId => AIArray.push(new AI(EntityId, sendEvent, resolve)));
    });

  entityGet = ({ data }: EntityGetData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByEntityId(AIArray, data.sent.EntityId);
    if (!ai) {
      return;
    }

    switch (ENTITY_TYPE_ENUM[data.response.Entity.Type]) {
      case 'CONTEXT':
        break;
      case 'VARIABLE':
        ai.addVariable(data.response.Entity);
        break;
      case 'FUNCTION':
        ai.addFunction(data.response.Entity);
        break;
      case 'DATA_TYPE':
        break;
      case 'ENUM_TYPE':
        ai.addEnum(data.response.Entity);
        break;
      case 'OBJECT_TYPE':
        break;
      case 'LIST_TYPE':
        break;
      default:
        break;
    }
  };

  resetDone = (data: string) => {
    console.info('[INFO] GLOBAL.RESET_DONE not yet implemented. Received with =>', data);
  };
}
