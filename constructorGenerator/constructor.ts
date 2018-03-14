class Constructor{

    fields:Field[]
    className:string

    constructor(className:string, fields:Field[]){
        this.fields = fields
        this.className = className
    }

    generateString(lang:Language):string{
        
        var assignmentString:string[] = []
        var parameterStrings:string[] = []
        var fieldsDeclarations:string[] = []
        for(var field of this.fields){
            parameterStrings.push(`${field.name}:${field.type}`)
            assignmentString.push(`this.${field.name} = ${field.name};`)
            fieldsDeclarations.push(`${field.name}:${field.type};`)
        }
        

        var constructorTemplate = 
`class ${this.className}{
    ${fieldsDeclarations.join('\n    ')}

    constructor(${parameterStrings.join(',')}){
        ${assignmentString.join('\n\t')}
    }
}`
        return constructorTemplate
    }
}

enum Language{js,ts,cs}

class Field{
    name:string
    type:string

    static string = 'string'
    static boolean = 'boolean'
    static number = 'number'
    static any = 'any'

    constructor(name:string,type:string){
        this.name = name
        this.type = type
    }
}