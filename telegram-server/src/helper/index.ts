const convertArgs = (data: Array<string>)=>{
    const argsValue: any = {};
    data.forEach((args:string)=>{
        let key = args.split('=')[0];
        const value = args.split('=')[1];
        key = key.split('--')[1];
        argsValue[key] = value;
    })
    return argsValue;
}

export {
    convertArgs
}