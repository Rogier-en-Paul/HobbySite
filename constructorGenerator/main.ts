/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="constructor.ts" />
/// <reference path="constructorApp.ts" />

var testConstructor = new Constructor('Test',[
    new Field('name',Field.string),
    new Field('child','Test'),
    new Field('age',Field.number),
])

var appcontainer = document.querySelector('#appcontainer') as HTMLElement

new ConstructorApp(appcontainer)
