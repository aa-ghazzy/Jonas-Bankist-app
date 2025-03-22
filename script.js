'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Here
// GLOBAL VARS
let currAccount;
let transferAccount;
// let currBalance;

//INSERT HTML

// ADD FIRST LETTER TO OBJ
const usersFirstLetters = function (accs) {
  return accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(item => item[0])
      .join('');
  });
};
usersFirstLetters(accounts);

// ADD BALANCE TO OBJ
const calcBalance = movs => movs.reduce((acc, curr) => (acc += curr));

const usersCurrBalance = function (accs) {
  accs.forEach(function (acc) {
    acc.balance = calcBalance(acc.movements);
  });
};
usersCurrBalance(accounts);

// DISPLAY MOVEMENTS
const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  let AllHtml = '';
  movs.forEach((mov, i) => {
    // const depoOrWith = mov > 0 ? 'deposit' : 'withdrawal';
    AllHtml =
      `
    <div class="movements__row">
      <div class="movements__type movements__type--${
        mov > 0 ? 'deposit' : 'withdrawal'
      }">${i + 1} ${mov > 0 ? 'deposit' : 'withdrawal'}</div>
      <div class="movements__date"></div>
      <div class="movements__value">${mov}€</div>
    </div>` + AllHtml;
  });
  containerMovements.textContent = '';
  containerMovements.insertAdjacentHTML('afterbegin', AllHtml);
};

const displayBalance = function (movs) {
  labelBalance.textContent = `${calcBalance(movs)}€`;
};

// calcDisplayBalance(movements);

// console.log(
//   movements.reduce((acc, curr) => {
//     if (acc > curr) return acc;
//     else return curr;
//   }, movements[0])
// );

const displaySummary = function (account) {
  const deposites = account.movements
    .filter(item => item > 0)
    .reduce((acc, curr) => (acc += curr));

  const withdrawals =
    account.movements
      .filter(item => item < 0)
      .reduce((acc, curr) => (acc += curr)) * -1;

  const interest = account.movements // Dont understand this at all
    .filter(item => item > 0)
    .map((item, i, arr) => (item * account.interestRate) / 100)
    .filter(item => item >= 1)
    .reduce((acc, curr, i, arr) => (acc += curr));

  labelSumIn.textContent = `${deposites}€`;
  labelSumOut.textContent = `${withdrawals}€`;
  labelSumInterest.textContent = `${interest}€`;

  // labelSumOut.textContent = `${Math.abs(withdrawals)}€`

  // console.log(deposites, withdrawals);
};

// displaySummary(movements);

// UPDATE-UI
const updateUI = function (acc) {
  displayMovements(acc.movements);
  displayBalance(acc.movements);
  displaySummary(acc);
};

// LOGIN

const loginAuth = function (e) {
  e.preventDefault();

  currAccount = accounts.find(
    account => inputLoginUsername.value === account.userName
  );

  if (currAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    updateUI(currAccount);

    inputLoginUsername.value = '';
    inputLoginPin.value = '';

    inputLoginUsername.blur(); //<<Removes focus after submitting
    inputLoginPin.blur(); //<<Removes focus after submitting
  } else {
    inputLoginUsername.value = inputLoginPin.value = '';
  }
};
btnLogin.addEventListener('click', loginAuth);

// TRANSFER
const transferFunc = function (e) {
  e.preventDefault();

  transferAccount = accounts.find(
    acc => inputTransferTo.value === acc.userName
  );

  if (
    currAccount.balance >= Number(inputTransferAmount.value) &&
    Number(inputTransferAmount.value > 0) &&
    transferAccount?.userName !== currAccount.userName &&
    transferAccount
  ) {
    console.log('valid operation');

    currAccount.movements.push(-1 * Number(inputTransferAmount.value));
    transferAccount.movements.push(Number(inputTransferAmount.value));

    updateUI(currAccount);
  }
  inputTransferTo.value = inputTransferAmount.value = '';

  usersCurrBalance(accounts);
  console.log(currAccount);
  console.log(transferAccount);
};
btnTransfer.addEventListener('click', transferFunc);

// DELETE ACCOUNT

const deleteAcc = function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currAccount.userName &&
    Number(inputClosePin.value) === currAccount.pin
  ) {
    // console.log('correct');

    const accIndex = accounts.findIndex(
      acc => inputCloseUsername.value === acc.userName
    );
    console.log(accounts.splice(accIndex, 1));
    console.log(accounts);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
};

btnClose.addEventListener('click', deleteAcc);

// LOAN
const loanRequest = function (e) {
  e.preventDefault();

  if (
    Number(inputLoanAmount.value) > 0 &&
    currAccount.movements.some(
      item => item >= Number(inputLoanAmount.value) * 0.1
    )
  ) {
    console.log('valid');
    currAccount.movements.push(Number(inputLoanAmount.value));

    updateUI(currAccount);
    inputLoanAmount.value = '';
  }
};
btnLoan.addEventListener('click', loanRequest);

// SORT
// let sort = 0; //MY SOLUTION
// const sortMovements = function () {
//   const sortedMovs = currAccount.movements.slice().sort((a, b) => a - b);

//   if (sort === 0) {
//     displayMovements(sortedMovs);
//   } else displayMovements(currAccount.movements);

//   sort = sort === 0 ? (sort = 1) : (sort = 0);
// };

let sorted = false; // HIS SOLUTION
btnSort.addEventListener('click', function () {
  displayMovements(currAccount.movements, !sorted);
  sorted = !sorted;
});
