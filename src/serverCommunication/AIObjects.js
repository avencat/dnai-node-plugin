type Entity = {
  Type: number,
  Name: string,
  Id: number,
  Visibility: number,
};

type DataReceivedType = {
  Header: {
    id: number,
    magicNumber: number,
    packageSize: number,
  },
  Event: {
    name: string,
    data: string,
  },
};

export type { Entity, DataReceivedType };
