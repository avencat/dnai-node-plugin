// @flow
import type { Entity } from '../serverCommunication/AIObjects';
import type { Options } from '../serverCommunication/CommunicationStructs';
import { BASE_ENTITIES_ENUM, ENTITY_TYPE_ENUM, VISIBILITY_ENUM } from '../serverCommunication/Enums';

export default class AI {
  options: Options;

  entitiesID = [];

  enums = [];

  functions = [];

  variables = [];

  contexts = [];

  datas = [];

  objects = [];

  lists = [];

  APICalls = [];
  APICallsCount = 0;

  EntityId: number;

  sendEvent: Function;

  isReady: Function;
  isLoaded = false;

  waitForReturn: ?{
    resolve: Function,
    reject: Function,
  };

  waitForResponse: ?{
    resolve: Function,
    reject: Function,
  };

  send = (event: string, params: string) =>
    new Promise((resolve, reject) => {
      if (this.waitForResponse) {
        this.APICalls.push({ event, params });
      } else {
        if (this.options.verbose) {
          console.info(`[INFO] Manager.Reply ${JSON.stringify(JSON.parse(params), null, 2)}`);
        }
        this.sendEvent(event, params);
        this.APICallsCount += 1;
        this.waitForResponse = {
          resolve,
          reject,
        };
      }
    });

  receive = (data: any) => {
    if (this.waitForResponse) {
      this.APICallsCount -= 1;
      const { resolve } = this.waitForResponse;
      this.waitForResponse = null;
      resolve(data);
      if (this.APICalls.length) {
        const event = this.APICalls.shift();
        this.send(event.event, event.params);
      }
    } else if (this.APICalls.length) {
      const event = this.APICalls.shift();
      this.send(event.event, event.params);
    }
  };

  constructor(EntityId: number, sendEvent: Function, isReady: Function, options: Options) {
    this.EntityId = EntityId;
    this.isReady = isReady;
    this.sendEvent = sendEvent;
    this.waitForReturn = null;
    this.options = options;

    if (this.options.verbose) {
      console.info(`[INFO] Create an AI (ID: ${EntityId})`);
    }
    this.send('DECLARATOR.GET_CHILDREN', JSON.stringify({ EntityId }));
  }

  checkIfReady = () => {
    if (this.APICallsCount <= 0 && this.APICalls.length <= 0) {
      this.isLoaded = true;
      if (this.isReady && typeof this.isReady === 'function') {
        this.isReady();
      }
    }
  };

  getFunctionIDWithName = (name: string): number => {
    const func = this.functions.find(elem => elem.Name === name);

    if (func) {
      return func.Id;
    }

    return -1;
  };

  getVariableIDWithName = (name: string): number => {
    const variable = this.variables.find(elem => elem.Name === name);

    if (variable) {
      return variable.Id;
    }

    return -1;
  };

  addEntity = (EntityId: number) => {
    this.entitiesID.push(EntityId);
    this.send('GLOBAL.GET_ENTITY', JSON.stringify({ EntityId }));
  };

  addEnum = (Enum: Entity) => {
    this.receive(Enum);
    this.enums.push(Enum);
    this.send('ENUM.GET_VALUES', JSON.stringify({ EntityId: Enum.Id }));
  };

  addEnumValues = (EnumId: number, values: any) => {
    this.receive(values);
    const Enum = this.enums.find(_Enum => _Enum.Id === EnumId);

    if (Enum) {
      Enum.Values = values;
    }

    this.checkIfReady();
  };

  addFunction = (Function: Entity) => {
    this.receive(Function);
    this.functions.push(Function);
    this.send('FUNCTION.GET_PARAMS', JSON.stringify({ EntityId: Function.Id }));
    this.send('FUNCTION.GET_RETURNS', JSON.stringify({ EntityId: Function.Id }));
  };

  addFunctionParameters = (FunctionId: number, parameters: Array<any>) => {
    this.receive(parameters);
    const Function = this.functions.find(_Function => _Function.Id === FunctionId);

    if (Function) {
      Function.Parameters = parameters;
    }

    this.checkIfReady();
  };

  addFunctionReturns = (FunctionId: number, returns: Array<any>) => {
    this.receive(returns);
    const Function = this.functions.find(_Function => _Function.Id === FunctionId);

    if (Function) {
      Function.Returns = returns;
    }

    this.checkIfReady();
  };

  addVariable = (Variable: Entity) => {
    this.receive(Variable);
    this.variables.push(Variable);
    this.send('VARIABLE.GET_VALUE', JSON.stringify({ VariableId: Variable.Id }));
    this.send('VARIABLE.GET_TYPE', JSON.stringify({ VariableId: Variable.Id }));
  };

  addVariableValue = (VariableId: number, value: any) => {
    this.receive(value);
    const Variable = this.variables.find(_Variable => _Variable.Id === VariableId);

    if (Variable) {
      Variable.Value = value;
    }

    this.checkIfReady();
  };

  addVariableType = (VariableId: number, typeID: number) => {
    this.receive(typeID);
    const Variable = this.variables.find(_Variable => _Variable.Id === VariableId);

    if (Variable) {
      Object.assign(Variable, {
        VariableTypeID: typeID,
        VariableType: BASE_ENTITIES_ENUM[typeID],
      });
    }

    this.checkIfReady();
  };

  call = (name: string, Parameters: {}) =>
    new Promise((resolve, reject) => {
      const FuncId = this.getFunctionIDWithName(name);

      if (FuncId !== -1) {
        this.send('FUNCTION.CALL', JSON.stringify({ FuncId, Parameters }));
      } else {
        reject(new Error('Function does not exist in this AI.'));
      }
      if (this.waitForReturn) {
        const { reject: r } = this.waitForReturn;
        r(new Error('Requested by another'));
      }
      this.waitForReturn = {
        resolve,
        reject,
      };
    });

  called = (returns: {}) => {
    this.receive(returns);
    if (this.waitForReturn) {
      const { reject, resolve } = this.waitForReturn;
      this.waitForReturn = null;

      if (returns) {
        resolve(returns);
      } else {
        reject(new Error('An error occurred'));
      }
    }
  };

  setVariableValue = (name: string, Value: any) =>
    new Promise((resolve, reject) => {
      const VariableId = this.getVariableIDWithName(name);

      if (VariableId !== -1) {
        this.send('VARIABLE.SET_VALUE', JSON.stringify({ VariableId, Value }));
      } else {
        reject(new Error('Variable does not exist in this AI.'));
      }
      if (this.waitForReturn) {
        const { reject: r } = this.waitForReturn;
        r(new Error('Requested by another'));
      }
      this.waitForReturn = {
        resolve,
        reject,
      };
    });

  variableValueSet = (VariableId: number, value: any) => {
    this.receive(value);
    if (this.waitForReturn) {
      const { reject, resolve } = this.waitForReturn;
      this.waitForReturn = null;

      if (value) {
        const Variable = this.variables.find(_Variable => _Variable.Id === VariableId);

        if (Variable) {
          Variable.Value = value;
        }

        resolve(value);
      } else {
        reject(new Error('An error occurred'));
      }
    }
  };

  getDocumentation = () => {
    const doc = {
      enums: [],
      functions: [],
      variables: [],
      call: this.call,
      setVariableValue: this.setVariableValue,
    };

    this.variables.forEach(Var =>
      doc.variables.push({
        Name: Var.Name,
        Type: `${Var.TypeString}(${Var.VariableType})`,
        Value: Var.Value,
        Visibility: VISIBILITY_ENUM[Var.Visibility],
      }));

    this.enums.forEach(Enum =>
      doc.enums.push({
        Name: Enum.Name,
        Type: Enum.TypeString,
        Values: Enum.Values,
        Visibility: VISIBILITY_ENUM[Enum.Visibility],
      }));

    this.functions.forEach((Func) => {
      const Parameters = [];
      const Returns = [];

      Func.Parameters.forEach(Param =>
        Parameters.push({
          Name: Param.Name,
          Type: ENTITY_TYPE_ENUM[Param.Type],
          Visibility: VISIBILITY_ENUM[Param.Visibility],
        }));

      Func.Returns.forEach(Ret =>
        Returns.push({
          Name: Ret.Name,
          Type: ENTITY_TYPE_ENUM[Ret.Type],
          Visibility: VISIBILITY_ENUM[Ret.Visibility],
        }));

      doc.functions.push({
        Name: Func.Name,
        Parameters,
        Returns,
        Type: Func.TypeString,
        Visibility: VISIBILITY_ENUM[Func.Visibility],
      });
    });

    return doc;
  };
}
