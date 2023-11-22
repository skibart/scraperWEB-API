interface Slope {
  name: string;
  length: number;
  status: string;
}

interface SlopeObj {
  slopes: Slope[];
  openSlopesQuantity: number;
  slopeQuantity: number;
}

interface ReadyObj {
  name: string;
  resortId: string;
  region: string;
  img: string;
  openSlopes: Slope[];
  openSlopesQuantity: number;
  slopeQuantity: number;
  dateEpoch: number;
  dateLocal: Date;
}

export { Slope, ReadyObj, SlopeObj };
