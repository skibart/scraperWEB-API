interface Slope {
  name: string;
  length: number;
  status: string;
}

interface ReadyObj {
  name: string;
  resortId: string;
  region: string;
  img: string;
  openSlopes: Slope[];
  dateEpoch: number;
  dateLocal: Date;
}

export { Slope, ReadyObj };
