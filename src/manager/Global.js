// @flow
import AI from './AI';
import Utils from '../utils/Utils';
import { ENTITY_TYPE_ENUM } from '../serverCommunication/Enums';
import type { EntityExtended } from '../serverCommunication/AIObjects';
import type { Options } from '../serverCommunication/CommunicationStructs';

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
  loaded = ({ data }: LoadedData, sendEvent: Function, AIArray: Array<AI>, options: Options) =>
    new Promise((resolve) => {
      data.response.Projects.forEach(EntityId => AIArray.push(new AI(EntityId, sendEvent, resolve, options)));
    });

  entityGet = ({ data }: EntityGetData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByEntityId(AIArray, data.sent.EntityId);
    if (!ai) {
      return;
    }

    const entity: EntityExtended = { ...data.response.Entity };
    entity.TypeString = ENTITY_TYPE_ENUM[data.response.Entity.Type];

    switch (entity.TypeString) {
      case 'CONTEXT':
        break;
      case 'VARIABLE':
        ai.addVariable(entity);
        break;
      case 'FUNCTION':
        ai.addFunction(entity);
        break;
      case 'DATA_TYPE':
        break;
      case 'ENUM_TYPE':
        ai.addEnum(entity);
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
