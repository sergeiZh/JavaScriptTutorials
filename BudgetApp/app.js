const budgetController = (function (){
    class UserEntry {
        constructor(id, type, description, value){
            this.id = id;
            this.type = type;
            this.description = description;
            this.value = value;
        }
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    const generateId = function(userEntryDataStorage, type){
        // userEntryDataStorage is budgetController.data object that has
        // allItems object in it with 2 arrays - exp and inc according to class names on UI
        // those arrays store newly created expenses and incomes
        const userEntryByTypeArr = userEntryDataStorage.allItems[type];

        // for generating id we need to assign new id to each new value.
        // decided to have id=last item index + 1
        if(userEntryByTypeArr.length -1 < 0){
            return 0;
        } 
        const userEntryByTypeArrLastItem = userEntryByTypeArr[userEntryByTypeArr.length -1];
        return userEntryByTypeArrLastItem.id + 1;
    }


    return {
        addItem: function(type, des, value){

            const id = generateId(data, type);
            const userEntryValue = new UserEntry(id, type, des, value);
            data.allItems[type].push(userEntryValue);

            return userEntryValue;
        },
        testController: function(){
            return data;
        }
    }
})();


const UIController = (function(){

    var DomNames = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'        
    }

    return {
        getInput: function(){
            return {
                type: document.querySelector(DomNames.inputType).value,
                description: document.querySelector(DomNames.inputDescription).value,
                value: document.querySelector(DomNames.inputValue).value 
            }
        },
        addListItem: function(userEntryObj){
            let itemHtml, userEntryContainer;
            // create HTML string with placeholder text
            if(userEntryObj.type === 'inc'){
                itemHtml = `<div class="item clearfix" id="income-${userEntryObj.id}"><div class="item__description">${userEntryObj.description}</div><div class="right clearfix"><div class="item__value">+ ${userEntryObj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
                userEntryContainer = DomNames.incomeContainer;
            } else if(userEntryObj.type === 'exp') {
                itemHtml = `<div class="item clearfix" id="expense-${userEntryObj.id}"><div class="item__description">${userEntryObj.description}</div><div class="right clearfix"><div class="item__value">- ${userEntryObj.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
                userEntryContainer = DomNames.expensesContainer;
            }

            // insert HTML into the DOM
            document.querySelector(userEntryContainer).insertAdjacentHTML('beforeend', itemHtml);
        },
        clearInputFields: function(){
            // according to documentation querySelectorAll returns NodeList object which is list and not an array
            // NodeList elements are selected DOM elements. One of the methods of the list is forEach method
            const selectedNodesList = document.querySelectorAll(`${DomNames.inputDescription},${DomNames.inputValue}`);
            const selectedNodesArray = Array.from(selectedNodesList);
            selectedNodesArray.forEach(selectedItem => selectedItem.value = "");
            document.querySelector(`${DomNames.inputDescription}`).focus();
        },
        getDomNames: function () {
            return DomNames;
        }
    }

})();


const controller = (function(uiController, modelController){

    var addItemToController = function() {

        // 1. Get fields input data
        const userInput = uiController.getInput();
        
        // 2. Add item to budget controller
        const userInputObj = modelController.addItem(userInput.type, userInput.description, userInput.value);

        // 3. Add item to UI
        uiController.addListItem(userInputObj);
        
        // 4. Clear input fields
        uiController.clearInputFields();


    }
    
    
    
    var setEventListeners = function(){
        const DomNames = uiController.getDomNames();
        if(DomNames){
            document.querySelector(DomNames.addButton).addEventListener("click", addItemToController);
        }

        document.addEventListener('keypress', function(event) {

            if(event.keyCode === 13 || event.which === 13){
                addItemToController();
            }
        });

    }    

    return {
        init: function(){
            return setEventListeners();
        }
    };

    

})(UIController, budgetController);

controller.init();