const path = '../'
const root = document.documentElement
let globalObjects = {}
let openElement = null

const log = (message) => {
	console.log(message)
}

const createHTMLElement = (data) => {

    // this returns a HTML object. 
    //you can pass it a JSON object specifying the attributes you would like
    //example of the JSON:
    // let variableName = {
    //     "UUID": this._UUID, 
    //     "type": "div",
    //     "class": "divClass",
    //     "id": "divID",
    //     "click": functionYouWantToRun,  
    //     "child": childHTMLElement,
    //     "attribute":{
    //         "key": attributeName,
    //         "value": attributeValue
    //     }
    // }

    // if you want to pass a function with parameters, it would look something like this: 

    // "click": function (){
    //     functionYouWantToRunWithParameters(param)
    // }

    // if you want to run a function associated with the object, it would look like this:

    // "click": function (){
    //     globalPieces[this.getAttribute('data-UUID')].objectFunctionYouWantToRun()
    // }

    // if you want to attach an attribute to the HTML object:
    // "attribute": {
    //     "key": key,
    //     "value": value
    // }

    // if you want to attach multiple attributes, pass an array of key/value as the 'attributes property':
    // "attributes": [
    //     {
    //         "key": key,
    //         "value": value
    //     },
    //     {
    //         "key": key,
    //         "value": value
    //     }
    // ]

    // you can pass a single child HTML element to child:
    // "child": childHTMLElement

    // you can pass multiple childHTMLElements to the children property in an array:
    // "children": [child1HTMLElement, child2HTMLElement]

	let element = document.createElement(data.type)
	
	if(data.UUID) element.setAttribute('data-UUID', data.UUID)
	if(data.id) element.id = data.id
	if(data.class) element.className = data.class
	if(data.click) element.addEventListener('click', data.click)
    if(data.blur) element.addEventListener('blur', data.blur)
	if(data.focus) element.addEventListener('focus', data.focus)
    if(data.change) element.addEventListener('change', data.change)
	if(data.innerHTML) element.innerHTML = data.innerHTML
	if(data.innerText) element.innerText = data.innerText
	if(data.attribute) element.setAttribute(data.attribute.key, data.attribute.value)
	if(data.attributes){
		for(attribute of data.attributes){
			element.setAttribute(attribute.key, attribute.value)
		}
	}
	if(data.child) element.appendChild(data.child)
	if(data.children){
		for(child of data.children){
			element.appendChild(child)
		}
	}
	if(data.title) element.title = data.title
    if(data.value) element.value = data.value
    if(data.placeholder) element.placeholder = data.placeholder

	return element
}

const createUUID = (object) => {
    //creates a unique ID that you can use to access, from globalObjects, the JS object associated with a created dom element
	let isUnique = false
	let UUID
	while(!isUnique){
		UUID = Math.floor(Math.random() * 99999 )
		if(!globalObjects[UUID]) isUnique = true
	}
	globalObjects[UUID] = object
	return UUID
}

const removeDomAndObjectReference = (element, removeParentToo) =>{
    //removes any object reference to elements children from globalObject
    //removes all children from the dom
    //if removeParentToo == true, does the same thing for the passed element

    let children = element.querySelectorAll('*')
    for(child of children){
        if(child.hasAttribute('data-uuid')) delete globalObjects[child.getAttribute('data-uuid')]
        child.remove()
    }
    if(removeParentToo){
        if(element.hasAttribute('data-uuid')) delete globalObjects[element.getAttribute('data-uuid')]
        element.remove()
    }
}

const setLocalStorage = (key, value) =>{
    localStorage.setItem(key, value)
}

const getLocalStorage = (key) =>{
    return localStorage.getItem(key)
}

const setSessionStorage = (key, value) =>{
    sessionStorage.setItem(key, value)
}

const getSessionStorage = (key) =>{
    return sessionStorage.getItem(key)
}

const XMLRequest = async (method, url, content) =>{
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                let response = xhr.response ? xhr.responseXML.childNodes[0] : null
                resolve(response)
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                })
            }
        }
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            })
        }
        xhr.send(content)
    })
}

const JSONRequest = async (method, url, content) =>{
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                let response = xhr.response ? JSON.parse(xhr.responseText) : null
                resolve(response)
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                })
            }
        }
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            })
        }
        xhr.send(content)
    })
}

const getFormattedDateAndTime = () =>{
    const d = new Date()
	const current_date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
	const period = d.getHours() >= 12 ? "PM" : "AM"
	const hour = d.getHours() > 12 ? d.getHours() - 12 : d.getHours()
	const minutes = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`
    return {
        time: `${hour}:${minutes} ${period}`,
        date: `${current_date}`
    }
}

const updateDate = () =>{
    const d = new Date()
	const current_date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
	const period = d.getHours() >= 12 ? "PM" : "AM"
	const hour = d.getHours() > 12 ? d.getHours() - 12 : d.getHours()
	const minutes = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`
    document.querySelector('#dateDisplay').innerText = `${hour}:${minutes} ${period} - ${current_date}`
}

class Util_Toggle{

    // this is a toggle switch. it returns a state of true or false
    // initialize a toggle with the following: let toggle = new Util_Toggle(value, settings, callback)
    // -value is true ('active') or false ('inactive'), sets the initial state of the toggle
    // -settings is a null or a JSON object to customize the colors of this specific toggle
    // -callback is null or a function of your choice. Your function should be setup to receive the value param back
    // -the key is the label that will be returned with the state when you use a Util_Input_Group

    // implementation example:
    // let main = document.querySelector('main')
    // let settings = {
    //     "wrapper": {
    //         "active": 'rgb(255,0,0)',
    //         "inactive": 'rgb(0,255,0)'
    //     },
    //     "thumb": {
    //         "color": 'rgb(0,0,255)'
    //     }
    // }
    // let toggle = new Util_Toggle(false, settings, toggleDarkMode)
    // main.appendChild(toggle.HTMLElement)

    // note: all settings are individually optional. 
    // globally change the color for ALL toggle (without specified colors) with: 
    // root.style.setProperty('--toggleThumb', *your color here*)
    // root.style.setProperty('--activeToggleWrapper', *your color here*)
    // root.style.setProperty('--inactiveToggleWrapper', *your color here*)

    //to retrieve the current value of toggle call: toggle.value

    constructor(value, settings, callback, key){
        this._UUID = createUUID(this)
        this._value = value
        this._key = key
        this._settings = settings
        this._callback = callback
        this._thumbHTML = this.prepareThumbHTML()
        this._wrapperHTML = this.prepareWrapperHTML(this._thumbHTML)
        if(this._settings != null){
            if(this._settings.thumb.color) this._thumbHTML.style.backgroundColor = this._settings.thumb.color
            if(this._value){
                if(this._settings.wrapper.active) this._wrapperHTML.style.backgroundColor = this._settings.wrapper.active
            }else{
                if(this._settings.wrapper.inactive) this._wrapperHTML.style.backgroundColor = this._settings.wrapper.inactive
            }
        }
    }

    get HTMLElement(){
        return this._wrapperHTML
    }

    get value(){
        return this._value
    }

    get key(){
        return this._key
    }

    get keyValue(){
        return {
            key: this._key,
            value: this._value
        }
    }

    get uuid(){
        return this._UUID
    }

    set value(value){
        this._value = value
    }

    prepareWrapperHTML(child){
        let HTMLData = {
            "UUID": this._UUID, 
            "type": "div",
            "class": this._value == true ? "util-toggleWrapper util-activeToggleWrapper" : "util-toggleWrapper util-inactiveToggleWrapper",
            "child": child,
            "click": function (){
                globalObjects[this.getAttribute('data-UUID')].toggleTheToggle()
            }
        }
        let wrapper = createHTMLElement(HTMLData)
        return wrapper
    }

    prepareThumbHTML(){
        let HTMLData = {
            "type": "div",
            "class": this._value == true ? "util-toggleThumb util-activeToggle" : "util-toggleThumb util-inactiveToggle"
        }
        let thumb = createHTMLElement(HTMLData)
        return thumb
    }

    markActive(){
        this._value = true
        this._thumbHTML.classList.remove('util-inactiveToggle')
        this._thumbHTML.classList.add('util-activeToggle')
        this._wrapperHTML.classList.remove('util-inactiveToggleWrapper')
        this._wrapperHTML.classList.add('util-activeToggleWrapper')
        if(this._settings != null && this._settings.wrapper.active){
            this._wrapperHTML.style.backgroundColor = this._settings.wrapper.active
        }
    }

    markInactive(){
        this._value = false
        this._thumbHTML.classList.remove('util-activeToggle')
        this._thumbHTML.classList.add('util-inactiveToggle')
        this._wrapperHTML.classList.remove('util-activeToggleWrapper')
        this._wrapperHTML.classList.add('util-inactiveToggleWrapper')
        if(this._settings != null && this._settings.wrapper.inactive){
            this._wrapperHTML.style.backgroundColor = this._settings.wrapper.inactive
        }
    }

    toggleTheToggle(){
        if(this._value){
            this.markInactive()
        }else{
            this.markActive()
        }
        if(this._callback != null) this._callback(this._value)
    }
}

class Util_Popup{
    // In order for this to work, the body element MUST have position set to relative
    constructor(title, message, buttons, associatedUUID){
        this._UUID = createUUID(this)
        this._title = title
        this._message = message
        this._associatedUUID = associatedUUID
        this._buttons = this.createPopupButtons(buttons)
        this._HTML = this.createHTML()
    }

    get associatedUUID(){
        return this._associatedUUID
    }

    show(){
        const body = document.querySelector('body')
        body.appendChild(this._HTML)
    }

    hide(){
        removeDomAndObjectReference(this._HTML, true)
    }

    createHTML(){
        const HTML = {
            "UUID": this._UUID,
            "type": "div",
            "class": "util-popupBackground",
            child: this.createPopupContentHTML()
        }
        return createHTMLElement(HTML)
    }

    createPopupContentHTML(){
        const popupChildren = []
        if(this._title){
            const titleHTML = {
                "type": "div",
                "class": "util-popupTitle",
                "innerText": this._title
            }
            popupChildren.push(createHTMLElement(titleHTML))
        }
    
        const messageHTML = {
            "type": "div",
            "class": "util-popupMessage",
            "innerText": this._message
        }
        popupChildren.push(createHTMLElement(messageHTML))

        const buttonWrapperHTML = {
            "type": "div",
            "class": "util-popupButtonWrapper",
            "children": this._buttons
        }
        popupChildren.push(createHTMLElement(buttonWrapperHTML))

        const popupHTML = {
            "type": "div",
            "class": "util-popupWrapper",
            "children": popupChildren
        }
        return createHTMLElement(popupHTML)
        
    }

    createPopupButtons(buttons){
        const buttonsArray = []
        for(const button of buttons){
            const btn = new Util_Popup_Button(this._UUID, button)
            buttonsArray.push(btn.HTMLElement)
        }
        return buttonsArray
    }
}

class Util_Popup_Button{
    constructor(parentPopup, data){
        this._UUID = createUUID(this)
        this._parentPopup = parentPopup
        this._data = data
        this._HTML = this.createHTML()
    }

    createHTML(){
        const HTML = {
            "UUID": this._UUID,
            "type": "div",
            "class": "util-popupButton",
            "innerText": this._data.text,
            "click": this._data.click
        }
        return createHTMLElement(HTML)
    }

    get HTMLElement(){
        return this._HTML
    }

    get parentPopup(){
        return this._parentPopup
    }
}

class Util_Input_Group{
    //You must pass this an array of the UUID's that are in this group
    constructor(inputs){
        this._UUID = createUUID(this)
        this._inputs = inputs
    }

    get values(){
        let results = {}
        for(let input of this._inputs){
            let inputObject = globalObjects[input].keyValue
            results[inputObject.key] = inputObject.value
        }
        return results
    }
}

class Util_Input{
    //label: the text that displays above the input, telling user what the field is for
    //key: the key associated with the value when retrieving data from object
    //value: the initial value, can be null
    //width: custom width for this specific input, can be left blank
    constructor(label, key, value, width){
        this._UUID = createUUID(this)
        this._label = label
        this._input = null
        this._key = key
        this._value = value ? value : ''
        this._width = width ? width : null
        this._HTML = this.createHTML()
    }

    get value(){
        return this._input.value
    }

    get key(){
        return this._key
    }

    get keyValue(){
        return {
            key: this._key,
            value: this._input.value
        }
    }

    get uuid(){
        return this._UUID
    }

    get HTMLElement(){
        return this._HTML
    }

    createHTML(){
        const children = []

        const textInput = {
            type: 'input',
            value: this._value,
            attributes: [
                {
                    key: 'type',
                    value: 'text'
                },
                {
                    key: 'required',
                    value: ''
                }
            ]
        }
        this._input = createHTMLElement(textInput)
        if(this._width) this._input.style.width = this._width
        children.push(this._input)

        const highlight = {
            type: 'span',
            class: 'util-textInput-highlight'
        }
        children.push(createHTMLElement(highlight))
        
        const bar = {
            type: 'span',
            class: 'util-textInput-bar'
        }
        const barHTML = createHTMLElement(bar)
        if(this._width) barHTML.style.width = this._width
        children.push(barHTML)
        
        const inputLabel = {
            type: 'label',
            innerText: this._label
        }
        children.push(createHTMLElement(inputLabel))
        
        const inputWrapper = {
            "UUID": this._UUID, 
            type: 'div',
            class: 'util-textInput-wrapper',
            children: children
        }

        return createHTMLElement(inputWrapper)
    }

}

// class Util_DatePicker{
//     constructor(range, setDates){
//         this._UUID = createUUID(this)
//         this._range = range
//         this._setDates = setDates
//         this._initialHTML = this.initialHTML()
//     }

//     get HTMLElement(){
//         return this._initialHTML
//     }

//     initialHTML(){
        
//         let pickerWrapperHTML = {
//             "UUID": this._UUID, 
//             "type": "div",
//             "class": "util-pickerWrapper",
//             "child": this.createPickerHeader()
//         }

//         return createHTMLElement(pickerWrapperHTML)
//     }

//     createPickerHeader(){

//         let children = []

//         let pickerInputsWrapperHTML = {
//             "type": "div", 
//             "class": "util-pickerInputsWrapper",
//             "children": this.createDateInputs()
//         }
//         children.push(createHTMLElement(pickerInputsWrapperHTML))

//         let pickerToggleHTML = {
//             "type": "div", 
//             "class": "util-pickerToggle",
//             "innerHTML": "&#128197;"
//         }
//         children.push(createHTMLElement(pickerToggleHTML))

//         let pickerHeaderHTML = {
//             "UUID": this._UUID, 
//             "type": "div",
//             "class": "util-pickerHeader",
//             "children": children
//         }

//         return createHTMLElement(pickerHeaderHTML)
//     }

//     createDateInputs(){
//         let children = []

//         let htmlone = {
//             "type": "div",
//             "class": "blue", 
//             "innerText": "Enter Date"
//         }
//         children.push(createHTMLElement(htmlone))

//         let htmltwo = {
//             "type": "span", 
//             "innerText": " to "
//         }
//         children.push(createHTMLElement(htmltwo))

//         let htmlthree = {
//             "type": "div",
//             "class": "blue", 
//             "innerText": "Enter Date"
//         }
//         children.push(createHTMLElement(htmlthree))















//         return children

//         // let children = []
//         // let count = this._range == true ? 1 : 0
        
//         // for(var i = 0; i <= count; i++){
//         //     let inputChildren = []
//         //     if(i == 1){
//         //         let toHTML = {
//         //             "type": "span", 
//         //             "innerText": 'to'
//         //         }
//         //         children.push(createHTMLElement(toHTML))
//         //     }

//         //     let monthInputHTML = {
//         //         "type": "input",
//         //         "placeholder": "mm", 
//         //         "class": "util-monthInput"
//         //     }
//         //     inputChildren.push(createHTMLElement(monthInputHTML))

//         //     let slashHTML = {
//         //         "type": "span",
//         //         "innerText": "/"
//         //     }
//         //     inputChildren.push(createHTMLElement(slashHTML))

//         //     let dayInputHTML = {
//         //         "type": "input",
//         //         "placeholder": "dd",
//         //         "class": "util-dayInput"
//         //     }
//         //     inputChildren.push(createHTMLElement(dayInputHTML))

//         //     inputChildren.push(createHTMLElement(slashHTML))

//         //     let yearInputHTML = {
//         //         "type": "input",
//         //         "placeholder": "yyyy",
//         //         "class": "util-yearInput"
//         //     }
//         //     inputChildren.push(createHTMLElement(yearInputHTML))

//         //     let manualInputWrapper = {
//         //         "type": "div", 
//         //         "children": inputChildren,
//         //         "class": "util-manualDateWrapper"
//         //     }

//         //     children.push(createHTMLElement(manualInputWrapper))

//         // }
//         // return children
//     }

// }

class Util_CheckBox{

}

class Util_RadioButtons{

}

class Util_RangeSlider{

}

class Util_Button{

}

class Util_Dropdown{
    constructor(settings){
    
        //required settings
        this._dataFormat = settings.dataFormat //XML/JSON
        this._sourceType = settings.sourceType //a URL / prebuilt data
        this._source = settings.source //the url / data

        //optional settings with default values
        this._createDestination = settings.createDestination || false
        this._searchable = settings.searchable || true
        this._multiselect = settings.multiselect || false
        this._entriesPerPage = settings.entriesPerPage || 8
        this._enableAll = settings.enableAll || false
        this._baseWidth = settings.baseWidth || null
        this._baseHeight = settings.baseHeight || null

        //optional stylization settings for this specific dropdown. They default to CSS and can be set globally for all instances





        this._UUID = createUUID(this)
        this._html = this.createHTML()
        this.formatData()

    }

    get HTMLElement(){
        if(this._createDestination){
            const wrapper = createHTMLElement({
                type: 'div',
                class: 'util-dropdownDestination',
                child: this._html
            })
            if(this._baseWidth) wrapper.style.width = this._baseWidth
            if(this._baseHeight) wrapper.style.height = this._baseHeight
            return wrapper
        }
        return this._html
    }

    get keys(){

    }

    get values(){

    }

    get keysAndValues(){

    }

    createDestination(){

    }

    async formatData(){
        let data = null
        if(this._sourceType == 'URL'){
            if(this._dataFormat == 'XML'){
                let result = await XMLRequest('GET', this._source)
                data = this.XMLToJSON(result)
            }else{
                data = await JSONRequest('GET', this._source)
            }
        }else if(this._dataFormat == 'XML'){
            data = this.XMLToJSON(this._source)
        }else{
            data = this._source
        }
        data = data.map(obj => ({...obj, selected: false}))
        this.createDropdownEntries(data)
    }

    XMLToJSON(XML){
        const data = []
        const entries = XML.childNodes
        for(let entry of entries){
            data.push({
                key: entry.getAttribute('key'),
                value: entry.getAttribute('value')
            })
        }
        return data
    }

    createDropdownEntries(data){
        console.log(data)
    }

    createHTML(){
        // alert('start')
    }

    // async cleanXML(){
    // }

   
}

class Util_Dropdown_Entry{

}

const clickTest = (e) =>{
    //needs a better name. 
    //put a couple things in the closeDropdown function to deal with the globals. 
    //still not a huge fan have resorting to globals. 
    //something weird is happening when I click off. 
        //the next time i go to open the dropdown, it does not open. Not until I click twice. 
    //also need to make the controls noselect. 
    console.log('click test')
    let position = e.target
    while(position.nodeName != '#document'){
        if(position.nodeName == 'DIV'){
            if(position.classList.contains('util-dd-wrapper')){
                let shouldIBeOpen = parseInt(position.getAttribute('data-shouldIBeOpen'))
                if(openElement === shouldIBeOpen) return console.log(openElement, shouldIBeOpen)
            }
        }
        position = position.parentNode
    }
    globalObjects[openElement.toString()].closeDropdown()
    return
    for(const globalObject in globalObjects){
        if(globalObjects[globalObject]?._closeWhenClickedOff) globalObjects[globalObject].closeDropdown()
    }
}   
