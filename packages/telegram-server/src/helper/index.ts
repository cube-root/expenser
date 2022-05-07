const convertArgs = (data: Array<string>) => {
  const argsValue: any = {};
  data.forEach((args:string) => {
    let key = args.split('=')[0];
    const value = args.split('=')[1];
    // eslint-disable-next-line prefer-destructuring
    key = key.split('--')[1];
    argsValue[key] = value;
  });
  return argsValue;
};

export default {
  convertArgs,
};
