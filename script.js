document.title = "Bank";
// Data
const account1 = {
  owner: "Garvit Jhalani",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 20000, 20000, -21000],
  interestRate: 1.2, // %
  pin: 5513,
};

const account2 = {
  owner: "Krishna Jasani",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, -2600, 100000],
  interestRate: 1.5,
  pin: 1619,
};

const account3 = {
  owner: "Kumar Aryan",
  movements: [200000, -200, 340, -300, -20, 50, 400, -460, -29000, 30000, 80000],
  interestRate: 1,
  pin: 8336,
};

const account4 = {
  owner: "Ashwin Vaishnav",
  movements: [430, 1000, 700, 50, 90, 11000],
  interestRate: 1,
  pin: 9876,
};

const account5 = {
  owner: "Harsh Yadav",
  movements: [10000000, 30000, -699, -69, -69, -69, -69, 40000],
  interestRate: 1,
  pin: 6969
}
const accounts = [account1, account2, account3, account4, account5];
const movements = account1.movements;

//Elements.

const labelWelcome = document.getElementsByClassName("welcome");
const labelDate = document.getElementsByClassName("date");
const labelBalance = document.getElementsByClassName("balance__value");
const labelSumIn = document.getElementsByClassName("summary__value--in");
const labelSumOut = document.getElementsByClassName("summary__value--out");
const labelSumInterest = document.getElementsByClassName(
  "summary__value--interest"
);
const labelTimer = document.getElementsByClassName("timer");
const containerApp = document.getElementsByClassName("app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.getElementsByClassName("login__btn");
const btnTransfer = document.getElementsByClassName("form__btn--transfer");

const btnClose = document.getElementsByClassName("form__btn--close");
const btnSort = document.getElementsByClassName("btn--sort");

const inputLoginUserName = document.querySelector(".login_input--user");
const inputLoginPin = document.getElementsByClassName("login__input--pin");
const inputTransferTo = document.getElementsByClassName("form__input--to");
const inputTransferAmount = document.getElementsByClassName(
  "form__input--amount"
);
const inputLoanAmount = document.getElementsByClassName(
  "form__input--loan-amount"
);
const inputCloseUsername = document.getElementsByClassName("form_input--user");
const inputClosePin = document.getElementsByClassName("form__input--pin");

//timer
const timeLogout = function () {

  let time = 180;
  let interval;

  interval = setInterval(function () {
    let minute = String(Math.trunc(time / 60)).padStart(2, '0');
    let seconds = String(time % 60).padStart(2, '0');
    document.querySelector('.timer').textContent = `${minute}:${seconds}`

    time--;

    if (!time) {
      clearInterval(interval)
      document.querySelector('.welcome').textContent = 'Log in to get started'
      document.querySelector('.app').style.opacity = 0; //UI is hidden.
    }

  }, 1000)


}

//
const movCheck = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => {
    return a - b;
  }) : movements;

  movs.forEach(function (mov, i) {
    let a = "";
    if (mov > 0) {
      a = "deposit";
    } else {
      a = "withdrawal";
    }
    const html = `   <div class="movements__row">
          <div class="movements__type movements__type--${a}">${i + 1} ${a}</div>
          <div class="movements__value">${mov}</div>
  `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};



const calcPrintBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov, i) =>
    acc + mov)
  acc.balance = balance
  document.querySelector('.balance__value').innerText = `${acc.balance} ₨`

}





const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter((mov) => {
    return mov > 0;
  }).reduce((acc, mov) => {
    return acc + mov;

  })
  document.querySelector('.summary__value--in').innerText = `${incomes} ₨`

  const out = acc.movements.filter((mov) => {
    return mov < 0;
  }).reduce((acc, mov) => {
    return acc + mov;
  })
  document.querySelector('.summary__value--out').innerText = `${Math.abs(out)} ₨ `

  const interest = acc.movements.filter((mov) => {
    return mov > 0
  }).map((deposit) => {
    return (deposit * acc.interestRate) / 100;
  }).filter((int) => {
    if (int > 1) {
      return true;
    }
    else {
      return false;
    }

  }).reduce((acc, int) => {
    return acc + int;
  })

  document.querySelector('.summary__value--interest').innerText = `${interest} ₨`

}




//computing psswrd for username.//pswd -> sks
const createUserNames = function (accs) {
  accs.forEach((acc) => {
    acc.userName = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('')

  })
}

//creating date functionality
const displayDate = function () {
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = now.getHours();
  const min = now.getMinutes();

  document.querySelector('.date').textContent = `${day}/${month}/${year}, ${hour}:${min}`;
}

createUserNames(accounts);

const updateUI = function (acc) {

  //display movement
  movCheck(acc.movements)

  //display balance
  calcPrintBalance(acc)

  //display summary
  calcDisplaySummary(acc)

  //dispaly date.
  displayDate();

  //display timer.
  timeLogout()


}


//creating login feature;
let currentAccount;

document.querySelector('.login__btn').addEventListener('click', (e) => {
  e.preventDefault(); // prevent form from submitting.
  // console.log(accounts)

  currentAccount = accounts.find((acc) => {
    return acc.userName === document.querySelector('.login__input--user').value

  })
  if (currentAccount?.pin === Number(document.querySelector('.login__input--pin').value)) {
    //Display UI: Welcome message, Dispaly balance/summary/movements.

    document.querySelector('.welcome').textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
  }
  document.querySelector('.app').style.opacity = 100;

  //clear input fields;
  document.querySelector('.login__input--user').value = document.querySelector('.login__input--pin').value = ''
  document.querySelector('.login__input--pin').blur();



  //update UI
  updateUI(currentAccount);

})

//adding transfer money functionality;
document.querySelector('.form__btn--transfer').addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(document.querySelector('.form__input--amount').value)
  const receiver = accounts.find((acc) =>
    acc.userName === document.querySelector('.form__input--to').value

  )

  document.querySelector('.form__input--to').value = document.querySelector('.form__input--amount').value = '';

  if (amount > 0 && receiver && currentAccount.balance >= amount
    && receiver?.userName !== currentAccount.userName) {

    //Doing the transfer..
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    //logoutTimerFunctionality called.


    //update UI
    updateUI(currentAccount)


  }

})

//Loan request functionality.

document.querySelector('.form__btn--loan').addEventListener('click', (e) => {
  e.preventDefault()

  const amount = Number(document.querySelector('.form__input--loan-amount').value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    //Add movement.
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
  document.querySelector('.form__input--loan-amount').value = "";

})

//Close account..

document.querySelector('.form__btn--close').addEventListener('click', (e) => {
  e.preventDefault();
  if (document.querySelector('.form__input--user').value == currentAccount.userName && document.querySelector('.form__input--pin').value == currentAccount.pin) {

    //find the account that matches with index
    const Index = accounts.findIndex((acc) => {
      return acc.userName === document.querySelector('.form__input--user').value
    })


    //delete the account from the accounts array.

    accounts.splice(Index, 1);

    //hide UI 
    document.querySelector('.app').style.opacity = 0;
    document.querySelector('.welcome').innerHTML = ""

  }
})

//sort functionality.
let sorted = false;
document.querySelector('.btn--sort').addEventListener('click', (e) => {
  e.preventDefault();
  movCheck(currentAccount.movements, !sorted);
  sorted = !sorted;
})
