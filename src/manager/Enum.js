// @flow
import Utils from '../utils/Utils';
import AI from './AI';

type ValuesGetData = {
  data: {
    response: {
      Values: {},
    },
    sent: {
      EntityId: number,
    },
  },
};

export default class Enum {
  valuesGet = ({ data }: ValuesGetData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByEntityId(AIArray, data.sent.EntityId);
    if (!ai) {
      return;
    }

    ai.addEnumValues(data.sent.EntityId, data.response.Values);
  };
}
