interface Slope {
  name: string;
  length: number;
  status: string;
}

interface ReadyObj {
  slopes: Slope[];
  dateEpoch: number;
  dateLocal: Date;
}

export { Slope, ReadyObj };
