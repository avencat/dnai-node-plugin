// @flow
import AI from './AI';
import Utils from '../utils/Utils';

type ChildrenGetData = {
  data: {
    sent: {
      EntityId: number,
    },
    response: {
      Children: Array<number>,
    },
  },
};

export default class Declarator {
  childrenGet = ({ data }: ChildrenGetData, AIArray: Array<AI>) => {
    const ai = Utils.getAIByAIId(AIArray, data.sent.EntityId);

    if (ai) {
      ai.receive();

      data.response.Children.forEach((EntityId: number) => {
        ai.addEntity(EntityId);
      });
    }
  };
}
