type Options = {
    value: any,
    label: String
}

type Template = {
    id: String,
    name: String,
    type: String,
    isNullable?: Boolean,
    options?: Array<Options>
}

