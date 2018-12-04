// @flow
import AI from './AI';
import Utils from '../utils/Utils';

type ValueGetData = {
  data: {
    sent: {
      VariableId: number,
    },
    response: {
      Value: any,
    },
  },
};

export default class Variable {
  typeGet = (data: string) => {
    console.info('[INFO] VARIABLE.TYPE_GET not yet implemented. Received with =>', data);
  };

  valueSet = ({ data }: ValueGetData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByEntityId(AIArray, data.sent.VariableId);
    if (!ai) {
      return;
    }

    ai.variableValueSet(data.sent.VariableId, data.response.Value);
  };

  valueGet = ({ data }: ValueGetData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByEntityId(AIArray, data.sent.VariableId);
    if (!ai) {
      return;
    }

    ai.addVariableValue(data.sent.VariableId, data.response.Value);
  };
}
