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
        },
        budget: 0,
        percentage: -1
    }

    // calculate total amount of expenses or income and update final total value for relevant user entry
    const calculateTotal = function(userEntryType){
        let total = 0;
        data.allItems[userEntryType].forEach(userEntryArrElement => total += userEntryArrElement.value);
        data.totals[userEntryType] = total;
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
        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');


            // calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;    

            // calculate the percentage of income that has been spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',        
        incomeLabel: '.budget__income--value',        
        expensesLabel: '.budget__expenses--value',        
        percentageLabel: '.budget__expenses--percentage',
        incomeExpensesContainer : '.container clearfix'        
    }

    return {
        getInput: function(){
            return {
                type: document.querySelector(DomNames.inputType).value,
                description: document.querySelector(DomNames.inputDescription).value,

                // value for budget calculator should be number
                value: parseFloat(document.querySelector(DomNames.inputValue).value) 
            }
        },
        addListItem: function(userEntryObj){
            let itemHtml, userEntryContainer;
            // create HTML string with placeholder text
            if(userEntryObj.type === 'inc'){
                itemHtml = `<div class="item clearfix" id="inc-${userEntryObj.id}"><div class="item__description">${userEntryObj.description}</div><div class="right clearfix"><div class="item__value">+ ${userEntryObj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
                userEntryContainer = DomNames.incomeContainer;
            } else if(userEntryObj.type === 'exp') {
                itemHtml = `<div class="item clearfix" id="exp-${userEntryObj.id}"><div class="item__description">${userEntryObj.description}</div><div class="right clearfix"><div class="item__value">- ${userEntryObj.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
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

            // return cursor to description input field
            document.querySelector(`${DomNames.inputDescription}`).focus();
        },
        // budgetObj is an object returned from BudgetController.getBudget() function
        displayBudget: function(budgetObj){
            document.querySelector(DomNames.budgetLabel).textContent = budgetObj.budget;
            document.querySelector(DomNames.incomeLabel).textContent = budgetObj.totalInc;
            document.querySelector(DomNames.expensesLabel).textContent = budgetObj.totalExp;
            if(budgetObj.percentage > 0){
                document.querySelector(DomNames.percentageLabel).textContent = `${budgetObj.percentage} %`;
            } else{
                document.querySelector(DomNames.percentageLabel).textContent = '0 %';
            }
        },
        getDomNames: function () {
            return DomNames;
        }
    }

})();


const controller = (function(uiController, modelController){

    const updateBudget = function(){
        // 1. Calculate budget
        modelController.calculateBudget();
        // 2. return budget
        const budget = modelController.getBudget();
        // 3. display budget on UI
        uiController.displayBudget(budget);
    }
    
    var addItemToController = function() {

        // 1. Get fields input data
        const userInput = uiController.getInput();

        // description should not be empty, budget value should be number greater than 0
        if(userInput.description !== "" && !isNaN(userInput.value) && userInput.value > 0){
            // 2. Add item to budget controller
            const userInputObj = modelController.addItem(userInput.type, userInput.description, userInput.value);
    
            // 3. Add item to UI
            uiController.addListItem(userInputObj);
            
            // 4. Clear input fields
            uiController.clearInputFields();

            // 5. Calculate and update budget
            updateBudget();
        }
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

        // listener is set not on particular expense or income but on parent element of them both
        document.querySelector(DomNames.incomeExpensesContainer).addEventListener('click', ctrlDeleteItem)

    }  
    
    // since this function will be invoked as callback function of event listener it could have access to the event
    // thats why that event is here 
    const ctrlDeleteItem = function(event){
        // event.target - returns node that was hit by event. In this case clicked
        // event.target.parentNode - returns parent node
        // also it's possible to traverse the DOM up by event.target.parentNode.parentNode.parentNode and so on

        const clickedItemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(clickedItemId){
            // assumed that clicked items would be inc-1, inc-2, exp-1 etc.
            const type = clickedItemId.split('-')[0];
            const id = clickedItemId.split('-')[1];

            // 1. Delete item from the data structure

            // 2. Delete item from the UI

            // 3. Update and show new budget

        }
    }

    return {
        init: function(){
            // displayBudget() function sets totals values according to values from the passed as parameter object
            // to set totals to 0 at start up we just need to pass that object with all values set to 0
            uiController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setEventListeners();
        }
    };

    

})(UIController, budgetController);

controller.init();