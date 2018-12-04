// @flow
import Utils from '../utils/Utils';
import AI from './AI';
import type { Entity } from '../serverCommunication/AIObjects';

type CalledData = {
  data: {
    response: {},
    sent: {
      EntityId: number,
    },
  },
};

type ParamsGetData = {
  data: {
    response: {
      Parameters: Array<Entity>,
    },
    sent: {
      EntityId: number,
    },
  },
};

type ReturnsGetData = {
  data: {
    response: {
      Returns: Array<Entity>,
    },
    sent: {
      EntityId: number,
    },
  },
};

export default class Function {
  instruction = (data: string, event: string) => {
    /* eslint-disable flowtype-errors/show-errors */
    this[`instruction${Utils.firstLetterToUpperCase(event)}`](data);
    /* eslint-enable flowtype-errors/show-errors */
  };

  instructionDataLinked = (data: string) => {
    console.info('[INFO] FUNCTION.INSTRUCTION.DATA_LINKED not yet implemented. Received with =>', data);
  };

  called = ({ data }: CalledData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByEntityId(AIArray, data.sent.EntityId);
    if (!ai) {
      return;
    }

    console.info('[INFO] FUNCTION.CALLED not yet implemented. Received with =>', data);
  };

  paramsGet = ({ data }: ParamsGetData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByEntityId(AIArray, data.sent.EntityId);
    if (!ai) {
      return;
    }

    ai.addFunctionParameters(data.sent.EntityId, data.response.Parameters);
  };

  returnsGet = ({ data }: ReturnsGetData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByEntityId(AIArray, data.sent.EntityId);
    if (!ai) {
      return;
    }

    ai.addFunctionReturns(data.sent.EntityId, data.response.Returns);
  };
}
