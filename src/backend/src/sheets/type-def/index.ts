type Options = {
  value: any;
  label: string;
};

type Template = {
  id: string;
  name: string;
  type: string;
  isNullable?: boolean;
  options?: Array<Options>;
};

export { Options, Template };
