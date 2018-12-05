type DataReceivedType = {
  Event: {
    data: string,
    name: string,
  },
  Header: {
    id: number,
    magicNumber: number,
    packageSize: number,
  },
};

type Entity = {
  Id: number,
  Name: string,
  Type: number,
  Visibility: number,
};

type EntityExtended = {
  Id: number,
  Name: string,
  Type: number,
  TypeString: string,
  Visibility: number,
};

export type { DataReceivedType, Entity, EntityExtended };
