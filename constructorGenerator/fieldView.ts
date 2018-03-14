/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/eventsystemx/EventSystem.ts" />


class FieldView{
    deleteelement: Element;
    element:HTMLElement
    nameelement:HTMLInputElement
    typeelement:HTMLInputElement
    field:Box<Field>
    deleteEvent:EventSystem<FieldView>

    constructor(element){
        var template = `
            <div style="display:flex;">
                <input id="name"></input>
                <input id="type"></input>
                <input id="delete" type="button" value="delete">
            </div>
        `
        this.element = createAndAppend(element,template)

        this.nameelement = this.element.querySelector('#name') as HTMLInputElement
        this.typeelement = this.element.querySelector('#type') as HTMLInputElement
        this.deleteelement = this.element.querySelector('#delete')
        this.field = new Box(new Field('','')) 
        this.deleteEvent = new EventSystem()

        this.nameelement.addEventListener('input', () => {
            this.field.value.name = this.nameelement.value
            this.field.onchange.trigger(this.field.value)
        })

        this.typeelement.addEventListener('input',() => {
            this.field.value.type = this.typeelement.value
            this.field.onchange.trigger(this.field.value)
        })

        this.deleteelement.addEventListener('click', () => {
            this.deleteEvent.trigger(this)
        })
    }
}