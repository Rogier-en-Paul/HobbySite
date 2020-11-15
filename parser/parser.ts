function updateParserError(state:ParserState,error:string):ParserState{
    return {
        ...state,
        isError:true,
        error:error + ` error at index ${state.index}: '${state.targetString.slice(state.index,10)}'`,
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

    constructor(cb:transformer){
        this.transformer = cb
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
        return new Parser((state) => {
            var nextstate = this.transformer(state)
            return updateParserState(nextstate,nextstate.index,cb(nextstate.result))
        })
    }

    chain(cb:(result:any) => Parser){
        return new Parser((state) => {
            var nextstate = this.transformer(state)
            var nextparser = cb(nextstate)
            return nextparser.transformer(nextstate)
        })
    }
}





var str = (s:string) => new Parser(state => {
    if (state.isError) {
        return state;
    }
    

    if(state.targetString.startsWith(s,state.index)){
        return updateParserState(state,state.index + s.length,s)
    }else{
        return updateParserError(state,`str: Tried to match "${s}"`)
    }
})

var tap = (cb) => new Parser((state) => {
    cb(state)
    return state
})

var brk = new Parser((state) => {
    console.log(state)
    debugger
    return state
})

var regex = (reg:RegExp) => new Parser(state => {

    if (state.isError) {
        return state;
    }

    reg.lastIndex = state.index
    var slicedtarget = state.targetString.slice(state.index)
    if(slicedtarget.length == 0){
        return updateParserError(state,`regex: unexpected end of input`)
    }

    var res = reg.exec(slicedtarget)
    if(res == null){
        return updateParserError(state,`regex: Tried to match "${reg.source}"`)
    }else{
        return updateParserState(state,state.index + res[0].length, res[0])
    }
    
})

var optional = (parser:Parser) => new Parser(state => {
    if (state.isError) return state;
    var nextstate = parser.transformer(state)
    if(nextstate.isError == true){
        updateParserResult(state,null)
    }else{
        return nextstate
    }
    return state
})

var letter = regex(/^[a-zA-Z]/)
var letters = regex(/^[a-zA-Z]+/)
var digit = regex(/^[0-9]/)
var digits = regex(/^[0-9]+/)
var whitespace = regex(/^\s+/)
var optws = optional(whitespace)
var lettersandws = regex(/^[a-zA-Z\s]+/)
var sequenceOf = (parsers:Parser[]) => new Parser(state => {
    
    if (state.isError) {
        return state;
    }

    var res = []
    var nextstate = state
    for(var parser of parsers){
        nextstate = parser.transformer(nextstate)
        res.push(nextstate.result)
    }

    return updateParserResult(nextstate,res) 
})

var namedSequence = (parserpairs:[name:string,parser:Parser][]) => {
    return sequenceOf(parserpairs.map(p => p[1])).map(res => {
        var object = {}
        res.forEach((element,i) => {
            object[parserpairs[i][0]] = element
        });
        return object
    })
}

var choice = (parsers:Parser[]) => new Parser(state => {

    if (state.isError) {
        return state;
    }

    for(var parser of parsers){
        var nextstate = parser.transformer(state)
        if(nextstate.isError == false){
            return nextstate
        }
    }

    return updateParserError(state,`Choice: unable to match any parsers`)
})

var between = (left:Parser,right:Parser) => (item:Parser) => sequenceOf([left,item,right]).map((state) => state[1])

var sepby = (separator:Parser) => (item:Parser) => new Parser(state => {
    var results = []
    let nextstate = state
    while(true){
        var wewantstate = item.transformer(nextstate)
        if(wewantstate.isError){
            break
        }
        results.push(wewantstate.result)
        nextstate = wewantstate

        var separatorstate = separator.transformer(nextstate)
        if(separatorstate.isError){
            break
        }
        nextstate = separatorstate

    }

    return updateParserState(nextstate,nextstate.index,results)
})

var sepby1 = (separator:Parser) => (item:Parser) => new Parser(state => {
    var res = sepby(separator)(item).transformer(state)
    if(res.result.length == 0){
        return updateParserError(res,`sepby1: Unable to capture atleast 1`)
    }else{
        return res
    }
})

var many = (parser:Parser) => new Parser(state => {

    if (state.isError) {
        return state;
    }

    var res = []
    var nextstate = state
    while(nextstate.isError == false){
        var teststate = parser.transformer(nextstate)
        if(teststate.isError == false){
            res.push(teststate.result)
            nextstate = teststate
        }else{
            break
        }
    }
    return updateParserResult(nextstate,res)
})



var many1 = (parser:Parser) => new Parser(state => {

    if (state.isError) {
        return state;
    }

    var res = many(parser).transformer(state)
    if(res.result.length == 0){
        return updateParserError(res,`many1: Unable to capture atleast 1`)
    }else{
        return res
    }
})

var lazy = (parserThunk:() => Parser) => new Parser(parserState => {
    const parser = parserThunk();
    return parser.transformer(parserState);
});

var startOfInput
var endOfInput


var tag = (type:string) => (value:any) => ({ type, value });