type Options = {
  value: any;
  label: string;
};

/* eslint-disable @typescript-eslint/no-unused-vars */
type Template = {
  id: string;
  name: string;
  type: string;
  isNullable?: boolean;
  options?: Array<Options>;
};

export {};
