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
}

const config = {
    home: document.createElement("background"),
    initialForm: document.getElementById("info"),
    bankPage: document.getElementById("bank-page"),
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

    config.initialForm.classList.add("d-none");
    config.bankPage.append(mainBankPage(userAccount));
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
        alert("Withdrawal");
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