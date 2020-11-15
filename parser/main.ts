/// <reference path="libs/vector/vector.ts" />
/// <reference path="libs/utils/rng.ts" />
/// <reference path="libs/utils/store.ts" />
/// <reference path="libs/utils/table.ts" />
/// <reference path="libs/utils/utils.ts" />
/// <reference path="libs/utils/stopwatch.ts" />
/// <reference path="libs/utils/anim.ts" />
/// <reference path="libs/rect/rect.ts" />
/// <reference path="libs/event/eventqueue.ts" />
/// <reference path="libs/event/eventsystem.ts" />
/// <reference path="parser.ts" />

var inputarea:HTMLTextAreaElement = document.querySelector('#input')
var outputarea:HTMLTextAreaElement = document.querySelector('#output')

inputarea.addEventListener('input', () => {
    convertInput2Output()
})

function convertInput2Output(){
    var sassast = stylesheet.run(inputarea.value).result
    var cssAst = transpileSassAst(sassast)
    outputarea.value = csstree2string(cssAst)
}

var betweenoptws = between(optws,optws)
var betweenquotes = between(str('"'),str('"'))

var keyvalueseparator = betweenoptws(str(':'))
var selector = letters
var selectorgroup = sepby(str(','))(selector)
var property = regex(/^[a-zA-Z\-]+/)
var pixels = sequenceOf([digits,str('px')]).map(res => ({type:'px',res:res.join('')}))
var hexcode = sequenceOf([str('#'),regex(/[a-fA-F0-9]{6}|[a-fA-F0-9]{3}/)]).map(res => ({type:'hex',res:res.join('')}))
var lettervalue = letters.map(res => ({type:'prop',res}))
var value = choice([pixels,hexcode,lettervalue])
var declaration = betweenoptws(sequenceOf([property,keyvalueseparator,value]).map(res => ({type:'declaration',key:res[0],val:res[2]})))
var recursionbit = lazy(() => choice([
    ruleset,
    declaration,
]))
var declarationblock = between(str('{'),str('}'))(sepby(sequenceOf([str(';'),optws]))(recursionbit))
var ruleset = betweenoptws(namedSequence([['selectorgroup',selectorgroup],['declarations',declarationblock]])).map(res => ({...res,type:'ruleset'}))
var stylesheet = many(ruleset) 

// var res = stylesheet.run(css)
// console.log(res)

// var flattenedcssast = transpileSassAst(res.result)
// console.log(flattenedcssast)

// console.log(csstree2string(flattenedcssast))


function transpileSassAst(ast){
    return ast.flatMap(rs => flatten(rs))
}

function flatten(baseruleset){
    
    baseruleset.selectorgroup
    baseruleset.declarations
    var normaldeclarations = baseruleset.declarations.filter(d => d.type == 'declaration')
    var rulesets = [{
        selectorgroup:baseruleset.selectorgroup,
        declarations:normaldeclarations,
    }]
    
    var rulesetdeclarations = baseruleset.declarations.filter(d => d.type == 'ruleset')
    rulesets.push(...rulesetdeclarations.flatMap(rs => {
        var flats = flatten(rs)
        flats.forEach(rs => rs.selectorgroup.unshift(...baseruleset.selectorgroup))
        return flats
    }))

    return rulesets
}

function csstree2string(rulesets){
    var res = ''

    for(var ruleset of rulesets){
        var decs = ruleset.declarations.map(dec => `${dec.key}:${dec.val.res};`)
        res += `${ruleset.selectorgroup.join(' ')}{
\t${decs.join('\n\t')}
}\n\n`
    }
    return res
}

convertInput2Output()

