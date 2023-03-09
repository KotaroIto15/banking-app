/**
 * ------------------------------------------------------------------------------------------------
 * CLASS DECLARATION: BankAcount
 * ------------------------------------------------------------------------------------------------
 */

class BankAccount {

    interest = 0.08;
    daysPerYear = 365;

    // constructor
    constructor(firstName, lastName, email, type, money) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.type = type;
        this.money = money;
        this.initialDeposit = money;
        this.accountNumber = getRandomInteger(10000000, 99999999);
    }

    getFullName() {
        return this.firstName + " " + this.lastName;
    }

    /**
     * @param {String} verb : indicates the type of interaction. "take" if withdrawing, "deposit" if depositing, and "comeback" if leaving.
     * @param {int} amount : for withdrawal/deposit, money you want to either withdraw/deposit. For leaving, this is the # of days the user leaves.
     * if withdrawn, subtract amount from money.
     * if deposited, add amount to money.
     * if leaving, calculate the interest the user gains and update the balance based on the profit.
     */
    updateMoney(verb, amount) {
        if (verb === "take") this.money -= amount;
        else if (verb === "deposit") this.money += amount;
        else {
            let profit = (this.money * Math.pow(1 + this.interest, amount/this.daysPerYear)) - this.money;
            this.money += profit;
        }
    }
}

/**
 * ------------------------------------------------------------------------------------------------
 * CONSTANTS
 * ------------------------------------------------------------------------------------------------
 */
const config = {
    home: document.createElement("background"),
    initialForm: document.getElementById("info"),
    bankPage: document.getElementById("bank-page"),
    sidePage: document.getElementById("side-page"),
    calculationBox: document.getElementById("calculation-box"),
}

/**
 * ------------------------------------------------------------------------------------------------
 * HELPER FUNCTIONS
 * ------------------------------------------------------------------------------------------------
 */


/**
 * @param {HTMLElement} ele : element to hide
 * set ele to be invisible 
 */
function displayNone(ele) {
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
}

/**
 * @param {HTMLElement} ele : element to show
 * set ele to be visible from the user
 */
function displayBlock(ele) {
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
}

/**
 * @param {int} min : lower bound of the output
 * @param {int} max : upper bound of the output
 * @returns a random integer within the interval [min, max]
 */
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 
 * @param {HTMLElement} hide : a page to hide 
 * @param {HTMLElement} show : a page to show
 */
function switchPage(hide, show) {
    hide.innerHTML = "";
    show.innerHTML = "";
    displayNone(hide);
    displayBlock(show);
}

/**
 * @param {NodeListOf<Element>} inputs : the collection of bill inputs.
 * @returns total amount of money entered, as a String
 */
function billSummation(inputs) {
    total = 0;

    inputs.forEach(function(input) {
        if (input.value) total += parseInt(input.value) * input.dataset.bill;
    });

    return total.toString();
}

/**
 * @param {BankAccount} account : user's bank account, used for getting the current balance
 * @param {NodeListOf<Element>} inputs : the collection of bill inputs.
 * @returns the maximum amount the user can withdraw from their account.
 *          when the total amount the user have inputted is greater than 20% of their current balance,
 *          returns 20% of current balance. Otherwise, return the total amount inputted.
 */
function calculateWithdrawalAmount(account, inputs) {
    max_amount = account.money * 0.2;
    amount = parseInt(billSummation(inputs));

    return (max_amount < amount) ? max_amount.toString() : amount.toString();
}

/**
 * @param {NodeListOf<Element>} inputs : the collection of bill inputs.
 * @returns the amount of money the user is to deposit.
 */
function calculateDepositAmount(inputs) {
    return parseInt(billSummation(inputs));
}

/**
 * ------------------------------------------------------------------------------------------------
 * PAGE FUNCTIONS - MAIN
 * ------------------------------------------------------------------------------------------------
 */

/**
 * creates the instance of the user's account from the information given by the form.
 */
function initializeUserAccount() {
    let userAccount = new BankAccount(
        config.initialForm.querySelectorAll('input[name="first-name"]').item(0).value,
        config.initialForm.querySelectorAll('input[name="last-name"]').item(0).value,
        config.initialForm.querySelectorAll('input[name="email"]').item(0).value,
        config.initialForm.querySelectorAll('input[name="acc-type"]:checked').item(0).value,
        parseInt(config.initialForm.querySelectorAll('input[name="deposit"]').item(0).value),
    );

    switchPage(config.initialForm, config.bankPage);
    config.bankPage.append(mainBankPage(userAccount));
}

/**
 * @param {BankAccount} account : user's account information.
 * @returns a new HTML showing the user's account info along with the buttons for different menu (i.e., withdrawal, deposit, come back)
 */
function mainBankPage(account) {
    let basicInfo = document.createElement("div");
    basicInfo.classList.add("d-flex", "col-11", "flex-column", "align-items-end", "justify-content-center");

    let name = document.createElement("span");
    name.classList.add("info", "mt-2", "mb-2", "fw-bold");
    name.innerHTML = "Your Name: " + account.getFullName();

    let bankID = document.createElement("span");
    bankID.classList.add("info", "mb-2", "fw-bold");
    bankID.innerHTML = "Your Bank ID: " + account.accountNumber;

    let deposit = document.createElement("span");
    deposit.classList.add("info", "fw-bold");
    deposit.innerHTML = "Your First Deposit: $" + account.initialDeposit;

    basicInfo.append(name, bankID, deposit);

    let balance = document.createElement("div");
    balance.classList.add("balance", "d-flex", "col-11", "justify-content-around", "align-items-center", "bg-danger", "my-3", "py-2");
    balance.innerHTML = 
    `
        <span class = "info fs-2">Available Balance</span>
        <span class = "info fs-2">$${account.money}</span>
    `;

    let withdrawalMenu = document.createElement("div");
    withdrawalMenu.classList.add("col-11", "hoverable", "d-flex", "flex-column", "align-items-center", "justify-content-center", "my-3", "pb-2", "hover");
    
    // when the menu is selected, switches page to the withdrawal page.
    withdrawalMenu.addEventListener("click", function() {
        switchPage(config.bankPage, config.sidePage);
        config.sidePage.append(withdrawPage(account));
    });

    withdrawalMenu.innerHTML = 
    `
        <span class = "menu-title fs-3 my-2">WITHDRAWAL</span>
        <i class = "fas fa-wallet fa-4x"></i>
        <a href="#!">
            <div class = "mask overlay"></div>
        </a>
    `;

    let depositMenu = document.createElement("div");

    // when the menu is selected, switches page to the deposit page.
    depositMenu.addEventListener("click", function() {
        switchPage(config.bankPage, config.sidePage);
        config.sidePage.append(depositPage(account));
    });

    depositMenu.classList.add("col-11", "hoverable", "d-flex", "flex-column", "align-items-center", "justify-content-center",
    "position-relative", "my-3", "pb-2", "hover");
    depositMenu.innerHTML = 
    `
        <span class = "menu-title fs-3 my-2"> DEPOSIT </span>
        <i class = "fas fa-coins fa-4x"></i>
    `;

    let comebackMenu = document.createElement("div");

    // when the menu is selected, switches page to the come-back page.
    comebackMenu.addEventListener("click", function() {
        switchPage(config.bankPage, config.sidePage);
        config.sidePage.append(comebackPage(account));
    });

    comebackMenu.classList.add("col-11", "hoverable", "d-flex", "flex-column", "align-items-center", "justify-content-center",
    "position-relative", "my-3", "pb-2", "hover");
    comebackMenu.innerHTML = 
    `
        <span class = "menu-title fs-3 my-2"> COME BACK LATER </span>
        <i class = "fas fa-home fa-4x"></i>
    `;

    let container = document.createElement("div");
    container.classList.add("account-page", "d-flex", "col-10", "flex-column", "align-items-center");
    container.append(basicInfo, balance, withdrawalMenu, depositMenu, comebackMenu);


    return container;
}

/**
 * @param {BankAccount} account : user's bank account information 
 * @returns a new HTML page of withdrawal menu. (fields to enter the bills to withdraw, buttons to either go back to previous menu or proceed)
 */
function withdrawPage(account) {
    let container = billInputSelector("Please Enter The Withdrawal Amount", "Go Back", "Next");

    let inputs = container.querySelectorAll(".bill-input");

    // when each input field is changed, it updates the total amount to be withdrawn
    inputs.forEach(function(input) {
        input.addEventListener("change", function() {
            let total = container.querySelector("#total");
            total.innerHTML = billSummation(inputs);
        });
    }); 

    let back = container.querySelector("#go-back");

    // when the button is pressed, jumps back to account info page.
    back.addEventListener("click", function() {
        switchPage(config.sidePage, config.bankPage);
        config.bankPage.append(mainBankPage(account));
    });

    let next = container.querySelector("#confirm");

    // when the button is pressed, proceed to the confirmation page.
    next.addEventListener("click", function() {
        switchPage(config.sidePage, config.calculationBox);
        config.calculationBox.append(calculationBoxPage("take", account, inputs));
    });

    return container;
}

/**
 * @param {BankAccount} account :  user's bank account information 
 * @returns a new HTML page of deposit menu. (fields to enter the bills to deposit, buttons to either go back to previous menu or proceed)
 */
function depositPage(account) {
    let container = billInputSelector("Please Enter the Deposit Amount", "Go Back", "Next");

    let inputs = container.querySelectorAll(".bill-input");

    // when each input field is changed, it updates the total amount to be deposited
    inputs.forEach(function(input) {
        input.addEventListener("change", function() {
            let total = container.querySelector("#total");
            total.innerHTML = billSummation(inputs);
        });
    });

    let back = container.querySelector("#go-back");

    // when the button is pressed, jumps back to account info page.
    back.addEventListener("click", function() {
        switchPage(config.sidePage, config.bankPage);
        config.bankPage.append(mainBankPage(account));
    });

    // when the button is pressed, proceed to the confirmation page.
    let next = container.querySelector("#confirm");
    next.addEventListener("click", function() {
        switchPage(config.sidePage, config.calculationBox);
        config.calculationBox.append(calculationBoxPage("deposit", account, inputs));
    });
    
    return container;
}

/**
 * @param {BankAccount} account : user's bank account info
 */
function comebackPage(account) {
    let container = document.createElement("div");
    container.classList.add("d-flex", "bg-light", "col-10", "flex-column", "align-items-center", "py-3");

    container.innerHTML = 
    `
    <div id = "section-title" class = "d-flex col-10 justify-content-center align-items-center">
        <p class = "fw-bold fs-2 text-center">How many days will you be gone?</p>
    </div>

    <div id = "days-div" class = "d-flex col-10 align-items-center my-2">
        <input type="number" id = "days" class = "vw-100 text-start border-dark fw-bold rounded py-1" placeholder="4 days">
    </div>
    `;

    container.append(backNextBtn("Go Back", "Confirm"));

    let back = container.querySelector("#go-back");
    back.addEventListener("click", function() {
        switchPage(config.sidePage, config.bankPage);
        config.bankPage.append(mainBankPage(account));
    });

    let confirm = container.querySelector("#confirm");
    confirm.addEventListener("click", function() {
        let days = container.querySelector("#days");

        if (!days.value) {
            alert("Please fill the required field before proceeding.");
        } else {
            account.updateMoney("comeback", parseInt(days.value));
            switchPage(config.sidePage, config.bankPage);
            config.bankPage.append(mainBankPage(account));
        }     
    });

    return container;
}

/**
 * @param {string} verb : indicates from which page (withdrawal, deposit) the user comes.
 * @param {BankAccount} account : user's account info.
 * @param {NodeListOf<Element>} inputs : collection of bill inputs.
 * @returns a new HTML page of confirmation of the amount to be withdrawn/deposited, depending on the previous page.
 */
function calculationBoxPage(verb, account, inputs) {

    // if withdrawing, calculate the actual amount the user can withdraw; if depositing, calculate the total amount of deposit.
    let total = (verb === "take") ? calculateWithdrawalAmount(account, inputs) : calculateDepositAmount(inputs);
    let container = billDialog(verb, inputs, total);

    // when pressing the button, go back to the previous page (either withdrawal page or deposit page)
    let back = container.querySelector("#go-back");
    back.addEventListener("click", function() {
        switchPage(config.calculationBox, config.sidePage);
        
        if (verb === "take") config.sidePage.append(withdrawPage(account));
        else config.sidePage.append(depositPage(account));
    });

    // when pressing the button, updates the balance of the account and goes back to the bank information page.
    let confirm = container.querySelector("#confirm");
    confirm.addEventListener("click", function() {
        account.updateMoney(verb, parseInt(total));
        switchPage(config.calculationBox, config.bankPage);
        config.bankPage.append(mainBankPage(account));
    });

    return container;
}


/**
 * ------------------------------------------------------------------------------------------------
 * PAGE FUNCTIONS - HELPER
 * ------------------------------------------------------------------------------------------------
 */

/**
 * @param {String} backString : title of the "go back" button
 * @param {String} nextString : title of the "next" button
 * @returns an HTML element containing the two buttons; one operates going back to previous page, one operates proceeding.
 */
function backNextBtn(backString, nextString) {
    let container = document.createElement("div");

    container.classList.add("d-flex", "justify-content-center", "col-11", "mt-3", "mb-4")
    container.innerHTML = 
    `
        <button id="go-back" class="btn btn-outline-primary col-5 mx-1">${backString}</button>
        <button id="confirm" class="btn btn-primary text-light fw-bold col-5">${nextString}</button>
    `;

    return container;
}

/**
 * @param {String} title : title of the page (either withdrawal or deposit)
 * @param {String} backString : title of the "go back" button (to be passed onto the helper function)
 * @param {String} nextString : title of the "next button" (to be passed onto the helper fn)
 * @returns a HTML element that contains bill input fields, go-back and next buttons and the field to show the total amount inputted so far.
 */
function billInputSelector(title, backString, nextString) {
    let container = document.createElement("div");
    container.classList.add("d-flex", "bg-light", "col-10", "flex-column", "align-items-center");

    container.innerHTML = 
    `
    <div id = "section0-title" class = "d-flex col-11 mt-3">
        <p class = "fw-bold fs-2 vw-100 text-center">${title}</p>
    </div>

    <div id = "amounts" class = "d-flex col-11 flex-column align-items-center">
        <div id = "100-dollar" class = "d-flex col-10 justify-content-between mb-2">
            <span class="text-start">$100</span>
            <input type="number" id="100" class="w-75 text-end rounded border-2 border-dark bill-input" placeholder="Please enter amount" data-bill="100">
        </div>

        <div id = "50-dollar" class = "d-flex col-10 justify-content-between my-2">
            <span class="text-start">$50</span>
            <input type="number" id="50" class="w-75 text-end rounded border-2 border-dark bill-input" placeholder="Please enter amount" data-bill="50">
        </div>

        <div id = "20-dollar" class = "d-flex col-10 justify-content-between my-2">
            <span class="text-start">$20</span>
            <input type="number" id="20" class="w-75 text-end rounded border-2 border-dark bill-input" placeholder="Please enter amount" data-bill="20">
        </div>

        <div id = "10-dollar" class = "d-flex col-10 justify-content-between my-2">
            <span class="text-start">$10</span>
            <input type="number" id="10" class="w-75 text-end rounded border-2 border-dark bill-input" placeholder="Please enter amount" data-bill="10">
        </div>

        <div id = "5-dollar" class = "d-flex col-10 justify-content-between my-2">
            <span class="text-start">$5</span>
            <input type="number" id="5" class="w-75 text-end rounded border-2 border-dark bill-input" placeholder="Please enter amount" data-bill="5">
        </div>

        <div id = "1-dollar" class = "d-flex col-10 justify-content-between my-2">
            <span class="text-start">$1</span>
            <input type="number" id="1" class="w-75 text-end rounded border-2 border-dark bill-input" placeholder="Please enter amount" data-bill="1">
        </div>
    </div>

    <div id="total-div" class="d-flex col-10 justify-content-center align-items-center bg-primary bg-gradient my-3">
        <span id="total" class="fs-6 text-light my-2">0.00</span>
    </div>
    `;

    container.append(backNextBtn(backString, nextString));

    return container;
}

/**
 * @param {String} verb : used for the main message on the top of the page (either "take" or "deposit")
 * @param {NodeListOf<Element>} inputs : used to render the values users inputted in the previous page
 * @param {int} totalAmount : total amount to withdraw/deposit.
 * @returns an HTML element with list of bills users have answered, buttons to go back and proceed.
 */
function billDialog(verb, inputs, totalAmount) {
    let main = document.createElement("div");
    main.classList.add("bg-light", "d-flex", "col-10", "flex-column", "align-items-center");

    main.innerHTML = 
    `
    <div id="section-title" class="d-flex mt-3 col-11 justify-content-center align-items-center">
        <p class="fw-bold fs-2 text-dark text-center">The money you are going to ${verb} is ...</p>
    </div>

    <div id='amounts-div' class="d-flex bg-dark flex-column col-8 p-1">
        <div id="$100" class="d-flex col-12 justify-content-end border border-light my-1">
            <span class="fs-4 text-light text-end m-2">${(inputs[0].value) ? inputs[0].value : "0"} x $100</span>
        </div>
        <div id="$50" class="d-flex col-12 justify-content-end border border-light my-1">
            <span class="fs-4 text-light text-end m-2">${(inputs[1].value) ? inputs[1].value : "0"} x $50</span>
        </div>
        <div id="$20" class="d-flex col-12 justify-content-end border border-light my-1">
            <span class="fs-4 text-light text-end m-2">${(inputs[2].value) ? inputs[2].value : "0"} x $20</span>
        </div>
        <div id="$5" class="d-flex col-12 justify-content-end border border-light my-1">
            <span class="fs-4 text-light text-end m-2">${(inputs[3].value) ? inputs[3].value : "0"} x $5</span>
        </div>
        <div id="$1" class="d-flex col-12 justify-content-end border border-light my-1">
            <span class="fs-4 text-light text-end m-2">${(inputs[4].value) ? inputs[4].value : "0"} x $1</span>
        </div>
        <div id="total" class="d-flex col-12 justify-content-between align-items-center mt-1 mb-2">
            <span class="text-start text-light m-1 fs-4">Total to be withdrawn:</span>
            <span class="text-end text-light m-1 fs-4">$${totalAmount}</span>
        </div>
    </div>
    `;

    main.append(backNextBtn("Go Back", "Confirm"));

    return main;
}