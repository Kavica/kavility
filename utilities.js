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

    //to retreive the current value of toggle call: toggle.value

    constructor(value, settings, callback){
        this._UUID = createUUID(this)
        this._value = value
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

class Util_Input{

}

class Util_DatePicker{
    constructor(range, setDates){
        this._UUID = createUUID(this)
        this._range = range
        this._setDates = setDates
        this._initialHTML = this.initialHTML()
    }

    get HTMLElement(){
        return this._initialHTML
    }

    initialHTML(){
        
        let pickerWrapperHTML = {
            "UUID": this._UUID, 
            "type": "div",
            "class": "util-pickerWrapper",
            "child": this.createPickerHeader()
        }

        return createHTMLElement(pickerWrapperHTML)
    }

    createPickerHeader(){

        let children = []

        let pickerInputsWrapperHTML = {
            "type": "div", 
            "class": "util-pickerInputsWrapper",
            "children": this.createDateInputs()
        }
        children.push(createHTMLElement(pickerInputsWrapperHTML))

        let pickerToggleHTML = {
            "type": "div", 
            "class": "util-pickerToggle",
            "innerHTML": "&#128197;"
        }
        children.push(createHTMLElement(pickerToggleHTML))

        let pickerHeaderHTML = {
            "UUID": this._UUID, 
            "type": "div",
            "class": "util-pickerHeader",
            "children": children
        }

        return createHTMLElement(pickerHeaderHTML)
    }

    createDateInputs(){
        let children = []

        let htmlone = {
            "type": "div",
            "class": "blue", 
            "innerText": "Enter Date"
        }
        children.push(createHTMLElement(htmlone))

        let htmltwo = {
            "type": "span", 
            "innerText": " to "
        }
        children.push(createHTMLElement(htmltwo))

        let htmlthree = {
            "type": "div",
            "class": "blue", 
            "innerText": "Enter Date"
        }
        children.push(createHTMLElement(htmlthree))















        return children

        // let children = []
        // let count = this._range == true ? 1 : 0
        
        // for(var i = 0; i <= count; i++){
        //     let inputChildren = []
        //     if(i == 1){
        //         let toHTML = {
        //             "type": "span", 
        //             "innerText": 'to'
        //         }
        //         children.push(createHTMLElement(toHTML))
        //     }

        //     let monthInputHTML = {
        //         "type": "input",
        //         "placeholder": "mm", 
        //         "class": "util-monthInput"
        //     }
        //     inputChildren.push(createHTMLElement(monthInputHTML))

        //     let slashHTML = {
        //         "type": "span",
        //         "innerText": "/"
        //     }
        //     inputChildren.push(createHTMLElement(slashHTML))

        //     let dayInputHTML = {
        //         "type": "input",
        //         "placeholder": "dd",
        //         "class": "util-dayInput"
        //     }
        //     inputChildren.push(createHTMLElement(dayInputHTML))

        //     inputChildren.push(createHTMLElement(slashHTML))

        //     let yearInputHTML = {
        //         "type": "input",
        //         "placeholder": "yyyy",
        //         "class": "util-yearInput"
        //     }
        //     inputChildren.push(createHTMLElement(yearInputHTML))

        //     let manualInputWrapper = {
        //         "type": "div", 
        //         "children": inputChildren,
        //         "class": "util-manualDateWrapper"
        //     }

        //     children.push(createHTMLElement(manualInputWrapper))

        // }
        // return children
    }

}

class Util_CheckBox{

}

class Util_RadioButtons{

}

class Util_RangeSlider{

}

class Util_Button{

}

class Util_Dropdown{
    constructor(title, data, config = {}){

        this._UUID = createUUID(this)
        this._title = title
        this._open = false
        this._data = data
        // this._config = config || {}
        

        this._entries = this.createEntries()

        // this._currentCollapseHeight = 0
        // this._collapseHeight = 0
        this._page = 1
        this._pages = 1

        this._pagination = false
        this._search = false

        this._multiSelect = !!config.multiSelect ? config.multiSelect : false
        this._limit = !!config.limit ? config.limit : 5

        this._closeWhenClickedOff = true

        if(this._data.length > this._limit){
            this._pagination = true
            this._search = true
            this._pages = Math.ceil(this._data.length / this._limit)
        }

        

        //setup the search
        //setup the navigation
            //this should be based on how many data options there are. If there are less than the display amount, then do not show the navigation. I should check for this in the config first. 
        //setup the catch for the entries, but do not fill it in yet.
        //set up the selected section. If that is in the config. 
        this._html = this.createHTML()
    }

    get HTMLElement(){
        return this._html
    }

    createHTML(){
        const children = []
        //create header
        children.push(this.createHeaderSection())

        //create collapse
        children.push(this.createCollapseSection())

        //create selected section

        const html = {
            "type": "div",
            "class": "util-dd-wrapper",
            "children": children,
            "attribute":{
                "key": 'data-shouldIBeOpen',
                "value": this._UUID
            }
        }

        return createHTMLElement(html)
    }

    createHeaderSection(){
        const children = []

        const titleHTML = {
            "type": "div",
            "class": "util-dd-title noSelect",
            "innerText": this._title
        }
        children.push(createHTMLElement(titleHTML))

        const arrow = createHTMLElement({
            "type": "div",
            "class": "util-dd-toggle-control-arrow",
            "innerHTML": "&#x2771;"
        })

        const controlHTML = {
            "type": "div",
            "class": "util-dd-toggle-control-wrapper",
            "children": [arrow]
        }
        children.push(createHTMLElement(controlHTML))

        const html = {
            "UUID": this._UUID,
            "type": "div",
            "class": "util-dd-header",
            "children": children,
            "click": function (){
                globalObjects[this.getAttribute('data-UUID')].toggleDropdown()
            }
        }
        return createHTMLElement(html)
    }

    createCollapseSection(){
        const children = []

        //search section
        children.push(this.createSearchSection())

        //naveigation section
        children.push(this.createNavigationSection())

        //entries section
        const entriesSection = {
            "type": "div",
            "class": "util-dd-entries-wrapper",
        }
        children.push(createHTMLElement(entriesSection))


        let html = {
            "type": "div",
            "class": "util-dd-collapse",
            "children": children
        }

        return createHTMLElement(html)
    }

    createSearchSection(){
        const children = []

        let searchHTML = {
            "type": "input",
            "class": "util-dd-search",
            "placeholder": "Search..."
        }
        children.push(createHTMLElement(searchHTML))

        let html = {
            "type": "div",
            "class": "util-dd-search-wrapper",
            "children": children
        }

        return createHTMLElement(html)
    }

    createNavigationSection(){
        const children = []

        let doubleBack = {
            "type": "div",
            "id": `${this._UUID}-doubleBack`,
            "class": "util-dd-nav-control",
            "innerHTML": "&#x2770;&#x2770;"
        }
        children.push(createHTMLElement(doubleBack))

        let back = {
            "type": "div",
            "id": `${this._UUID}-back`,
            "class": "util-dd-nav-control",
            "innerHTML": "&#x2770;"
        }
        children.push(createHTMLElement(back))

        let location = {
            "type": "div",
            "id": `${this._UUID}-location`,
            "class": "util-dd-nav-location",
            "innerText": `${this._page} of ${this._pages}`
        }
        children.push(createHTMLElement(location))

        let forward = {
            "type": "div",
            "id": `${this._UUID}-forward`,
            "class": "util-dd-nav-control",
            "innerHTML": "&#x2771;"
        }
        children.push(createHTMLElement(forward))

        let doubleForward = {
            "type": "div",
            "id": `${this._UUID}-doubleForward`,
            "class": "util-dd-nav-control",
            "innerHTML": "&#x2771;&#x2771;"
        }
        children.push(createHTMLElement(doubleForward))

        let html = {
            "type": "div",
            "class": "util-dd-nav-wrapper",
            "children": children
        }
        return createHTMLElement(html)
    }

    toggleDropdown(){
        if(this._open){
            this.closeDropdown()
        }else{
            this.openDropdown()
        }
        this._open = !this._open
    }

    openDropdown(){
        // setTimeout(document.addEventListener("click", this.detectOffClick.bind(this)), 100)
        // setTimeout(document.addEventListener('click', this.detectOffClick.bind(this)), 10000)
        const arrow = this._html.querySelector('.util-dd-toggle-control-arrow')
        const arrowWrapper = this._html.querySelector('.util-dd-toggle-control-wrapper')
        const collapse = this._html.querySelector('.util-dd-collapse')

        // arrow.classList.remove('util-dd-arrow-closed')
        arrow.classList.add('util-dd-arrow-open')

        // arrowWrapper.classList.remove('util-dd-arrow-wrapper-closed')
        arrowWrapper.classList.add('util-dd-arrow-wrapper-open')

        this.insertEntries()

        

        collapse.style.height = this.calculateCollapseHeight()

        // setTimeout(function(){ document.addEventListener("click", clickTest.bind(this)) }, 1000)
        // setTimeout(function(){ document.addEventListener("click", clickTest()) }, 1000)
        // setTimeout(function(){ document.addEventListener("click", this.detectOffClick.bind(this)) }, 10000)
        // setTimeout(function(){ document.addEventListener("click", function () {this.detectOffClick()}) }, 5000)
        // console.log(globalObjects)
        openElement = this._UUID
        console.log('openElement just set')
        console.log(typeof openElement)
        setTimeout(()=>{
            document.addEventListener('click', clickTest)
        },100)
        
    }

    closeDropdown(){
        openElement = null
        document.removeEventListener('click', clickTest)

        const arrow = this._html.querySelector('.util-dd-toggle-control-arrow')
        const arrowWrapper = this._html.querySelector('.util-dd-toggle-control-wrapper')
        const collapse = this._html.querySelector('.util-dd-collapse')
        
        arrow.classList.remove('util-dd-arrow-open')
        arrow.classList.add('util-dd-arrow-closed')
        arrow.addEventListener('animationend', () =>{
            this.removeClosingAnimationClasses()
        })

        arrowWrapper.classList.add('util-dd-arrow-wrapper-closed')
        arrowWrapper.classList.remove('util-dd-arrow-wrapper-open')

        collapse.style.height = '0rem'
        
    }

    removeClosingAnimationClasses(){
        const arrow = this._html.querySelector('.util-dd-toggle-control-arrow')
        const arrowWrapper = this._html.querySelector('.util-dd-toggle-control-wrapper')

        arrow.classList.remove('util-dd-arrow-closed')
        arrowWrapper.classList.remove('util-dd-arrow-wrapper-closed')
    }

    calculateCollapseHeight(){
        //need to calculate height of entries
        //maybe I should break this off into its own func, as I will otherwise do this twice
        let entryIndecies = this.calculateEntryIndecies()
        let entryCount = entryIndecies.end - entryIndecies.start
        //add in search and nav, if that is enabled
        if(this._pagination) entryCount++
        if(this._search) entryCount++

        let entryHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--util-dd-height').split('rem')[0])
        
        //this might be a good time to determine if it goes up or down
        // return '28rem'
        return `${entryCount * entryHeight}rem`
    }

    createEntries(){
        const children = []
        for(const entry of this._data){
            let newEntry = new Util_Dropdown_Item(entry, this._UUID)
            children.push(newEntry)
        }
        return children
    }

    insertEntries(){
        let entries = this._html.querySelector('.util-dd-entries-wrapper')
        // let start = (this._page * this._limit) - this._limit
        // let end = this._page * this._limit
        // if(end > this._entries.length) end = this._entries.length
        // console.log(start, end)
        let entryIndecies = this.calculateEntryIndecies()
        for(let i = entryIndecies.start; i < entryIndecies.end; i++){
            entries.appendChild(this._entries[i].HTMLElement)
        }
    }

    calculateEntryIndecies(){
        let start = (this._page * this._limit) - this._limit
        let end = this._page * this._limit
        if(end > this._entries.length) end = this._entries.length
        return {start, end}
    }

    detectOffClick(e){
        console.log(e.target)
        console.log(this._html)
        if(e.target !== this._html){
            console.log('closing')
            console.log(this)
            // this.closeDropdown.bind(this)
            this.closeDropdown()
        }else{
            console.log('not closing')
        }
    }

    // setTimeout(function(){ document.removeEventListener("click", detectClick); }, 100);
    // setTimeout(function(){ document.addEventListener("click", detectClick); }, 100);

    // function detectClick(e){
	// 	var classes = e.target.className.split(" ");
	// 	for(var i = 0; i < classes.length; i++){
	// 		if(classes[i].indexOf(uniqueIdentifier) !== -1){
	// 			return;
	// 		}else{
	// 			that.autoRunFunction();
	// 			that.closeDropdown();
	// 		}
	// 	}
	// }
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

class Util_Dropdown_Item{
    constructor(data, parentUUID){
        this._UUID = createUUID(this)
        this._data = data
        this._associatedUUID = parentUUID

        this._html = this.createHTML()
    }

    get HTMLElement(){
        return this._html
    }

    createHTML(){
        const children = []

        //entry text
        let text = {
            "type": "div",
            "class": "util-dd-text",
            "innerText": this._data.displayText
        }
        children.push(createHTMLElement(text))

        //entry indicator
        let indicator = {
            "type": "div",
            "class": "util-dd-indicator",
            "innerHTML": "&#10003;"
        }
        children.push(createHTMLElement(indicator))

        const html = {
            "type": "div",
            "class": "util-dd-entry-wrapper",
            "children": children
        }

        return createHTMLElement(html)
    }
}