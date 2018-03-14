/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="constructor.ts" />
/// <reference path="fieldView.ts" />

abstract class View{
    element:HTMLElement
    template:string

    constructor(element:HTMLElement,template:string){
        this.template = template
        this.element = createAndAppend(element,template)
    }
}

class ConstructorApp extends View{
    addFieldButton: Element;
    fieldscontainer:HTMLElement
    outputcontainer:HTMLElement
    fieldViews:FieldView[] = []

    constructor(element:HTMLElement){
        super(element,`
            <div style="display:flex;">
                <div>
                    <div id="fieldscontainer"></div>
                    <input type="button" id="addFieldButton" value="add field">
                </div>
                <textarea rows="40" cols="400" style="white-space: nowrap;  overflow: auto; " id="outputcontainer"></textarea>
            </div>
        `)
        this.fieldscontainer = this.element.querySelector('#fieldscontainer') as HTMLElement
        this.outputcontainer = this.element.querySelector('#outputcontainer') as HTMLElement
        this.addFieldButton = this.element.querySelector('#addFieldButton')

        var addFieldView = () => {
            var newFieldView = new FieldView(this.fieldscontainer)
            this.fieldViews.push(newFieldView)
            newFieldView.deleteEvent.listen((fieldView) => {
                this.fieldViews.splice(this.fieldViews.findIndex((el) => el == fieldView), 1)
                this.update()
                this.updateOutput()
            })
            newFieldView.field.onchange.listen((field) => {
                this.updateOutput()
            })
        }

        for(var i = 0; i < 3; i++){
            addFieldView()
        }

        this.addFieldButton.addEventListener('click',() => {
            addFieldView()
        })

        this.updateOutput()
    }

    update(){
        this.fieldscontainer.innerHTML = ''
        for(var view of this.fieldViews){
            this.fieldscontainer.appendChild(view.element)
        }
    }

    updateOutput(){
        var fields:Field[] = []
        for(var fieldView of this.fieldViews){
            fields.push(fieldView.field.get())
        }

        var ctor = new Constructor('test',fields)
        this.outputcontainer.innerHTML = ctor.generateString(Language.ts)
    }
}