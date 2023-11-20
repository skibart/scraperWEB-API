interface Slope {
  name: string;
  length: number;
  status: string;
}

interface ReadyObj {
  name: string;
  id: string;
  region: string;
  img: string;
  slopes: Slope[];
  dateEpoch: number;
  dateLocal: Date;
}

export { Slope, ReadyObj };
