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

type TypeGetData = {
  data: {
    sent: {
      VariableID: number,
    },
    response: {
      TypeID: number,
    },
  },
};

type ValueSetData = {
  data: {
    sent: {
      Value: any,
      VariableID: number,
    },
  },
};

export default class Variable {
  typeGet = ({ data }: TypeGetData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByEntityId(AIArray, data.sent.VariableID);
    if (!ai) {
      return;
    }

    ai.addVariableType(data.sent.VariableID, data.response.TypeID);
  };

  valueSet = ({ data }: ValueSetData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByEntityId(AIArray, data.sent.VariableID);
    if (!ai) {
      return;
    }

    ai.variableValueSet(data.sent.VariableID, data.sent.Value);
  };

  valueGet = ({ data }: ValueGetData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByEntityId(AIArray, data.sent.VariableId);
    if (!ai) {
      return;
    }

    ai.addVariableValue(data.sent.VariableId, data.response.Value);
  };
}
