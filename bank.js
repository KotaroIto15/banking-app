class BankAccount {
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

    updateMoney(amount) {
        this.money -= amount;
    }
}

const config = {
    home: document.createElement("background"),
    initialForm: document.getElementById("info"),
    bankPage: document.getElementById("bank-page"),
    sidePage: document.getElementById("side-page"),
    calculationBox: document.getElementById("calculation-box"),
}

function displayNone(ele) {
    ele.classList.remove("d=block");
    ele.classList.add("d-none");
}

function displayBlock(ele) {
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
}


function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function initializeUserAccount() {
    let userAccount = new BankAccount(
        config.initialForm.querySelectorAll('input[name="first-name"]').item(0).value,
        config.initialForm.querySelectorAll('input[name="last-name"]').item(0).value,
        config.initialForm.querySelectorAll('input[name="email"]').item(0).value,
        config.initialForm.querySelectorAll('input[name="acc-type"]:checked').item(0).value,
        parseInt(config.initialForm.querySelectorAll('input[name="deposit"]').item(0).value),
    );

    displayNone(config.initialForm);
    config.bankPage.append(mainBankPage(userAccount));
    displayBlock(config.bankPage);
}

function withdrawController(account) {
    displayNone(config.bankPage);
    config.sidePage.append(withdrawPage());
    displayBlock(config.sidePage);

    let inputs = document.querySelectorAll(".bill-input");
    inputs.forEach(function(input) {
        input.addEventListener("change", function() {
            let total = document.getElementById("total");
            total.innerHTML = billSummation(inputs);
        });
    }); 

    let back = document.getElementById("go-back");
    back.addEventListener("click", function() {
        displayNone(config.sidePage);
        displayBlock(config.bankPage);
        config.sidePage.innerHTML = "";
        config.bankPage.append(mainBankPage(account));
    });

    let next = document.getElementById("confirm");
    next.addEventListener("click", function() {
        config.sidePage.innerHTML = "";
        calculationBoxController(account, inputs);
    });
}

function calculationBoxController(account, inputs) {
    let total = calculateWithdrawalAmount(account, inputs);
    config.calculationBox.append(billDialog(inputs, total));
    displayNone(config.sidePage);
    displayBlock(config.calculationBox);

    let back = document.getElementById("go-back");
    back.addEventListener("click", function() {
        displayNone(config.calculationBox);
        displayBlock(config.sidePage);
        config.calculationBox.innerHTML = "";
        withdrawController(account);
    });

    let confirm = document.getElementById("confirm");
    confirm.addEventListener("click", function() {
        account.updateMoney(parseInt(total));
        displayNone(config.calculationBox);
        displayBlock(config.bankPage);
        config.calculationBox.innerHTML = "";
        config.bankPage.append(mainBankPage(account));
    });
}

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
    withdrawalMenu.addEventListener("click", function(){
        config.bankPage.innerHTML = "";
        withdrawController(account);
        event.preventDefault();
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
    depositMenu.addEventListener("click", function(){
        alert("Deposit");
    });
    depositMenu.classList.add("col-11", "hoverable", "d-flex", "flex-column", "align-items-center", "justify-content-center",
    "position-relative", "my-3", "pb-2", "hover");
    depositMenu.innerHTML = 
    `
        <span class = "menu-title fs-3 my-2"> DEPOSIT </span>
        <i class = "fas fa-coins fa-4x"></i>
    `;

    let comebackMenu = document.createElement("div");
    comebackMenu.addEventListener("click", function(){
        alert("Come back later");
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

function withdrawPage() {
    let container = billInputSelector("Please Enter The Withdrawal Amount", "Go Back", "Next");
    return container;
}

function billSummation(inputs) {
    total = 0;

    inputs.forEach(function(input) {
        if (input.value) total += parseInt(input.value) * input.dataset.bill;
    });

    return total.toString();
}

function billDialog(inputs, totalAmount) {
    let main = document.createElement("div");
    main.classList.add("bg-light", "d-flex", "col-10", "flex-column", "align-items-center");

    main.innerHTML = 
    `
    <div id="section-title" class="d-flex mt-3 col-11 justify-content-center align-items-center">
        <p class="fw-bold fs-2 text-dark text-center">The money you are going to take is ...</p>
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

function calculateWithdrawalAmount(account, inputs) {
    max_amount = account.money * 0.2;
    amount = parseInt(billSummation(inputs));

    return (max_amount < amount) ? max_amount.toString() : amount.toString();
}