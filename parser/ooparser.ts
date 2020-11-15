function updateParserError(state:ParserState,error:string):ParserState{
    return {
        ...state,
        isError:true,
        error:error + ` error at index ${state.index}: "${state.targetString.slice(state.index,10)}"`,
    }
}

function updateParserState(state:ParserState,index:number,result:any):ParserState{
    return {
        ...state,
        index,
        result,
    }
}

function updateParserResult(state:ParserState,result:any):ParserState{
    return {
        ...state,
        result,
    }
}

type transformer = (result:ParserState) => ParserState

class ParserState{
    index:number
    result:any
    targetString:string

    isError:boolean
    error:string
}

class Parser{
    transformer:transformer

    constructor(public type:string, public children:Parser[], cb:transformer){
        this.transformer = (state:ParserState) => {
            if(state.isError){
                return state
            }else{
                return cb(state)
            }
        }
    }

    run(string:string){
        var startstate:ParserState = {
            index:0,
            targetString:string,
            result:null,
            isError:false,
            error:null,
        }

        return this.transformer(startstate)
    }

    map(cb:(result:any) => any):Parser{
        
    }

    chain(){

    }
}

const sequenceOf = (parsers:Parser[]) => new Parser('sequenceof',parsers,(state) => {
    var res = []
    var nextstate = state
    for(var parser of parsers){
        nextstate = parser.transformer(nextstate)
        res.push(nextstate.result)
    }

    return updateParserResult(nextstate,res) 
})

const choice = (parser:Parser[]) => {
    
}

const many = (parser:Parser) => {
    
}

const optional = (parser:Parser) => {
    
}