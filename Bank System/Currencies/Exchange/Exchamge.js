let fromInput = document.querySelector(".exchange-page .from input");
let toInput = document.querySelector(".exchange-page .to input");
let fromSelect = document.querySelector(".exchange-page .from select");
let toSelect = document.querySelector(".exchange-page .to select");
let fromTxt = document.querySelector(".exchange-page .from-txt");
let toTxt = document.querySelector(".exchange-page .to-txt");

let fromObj, toObj;

function GetCurrencyObj(CurrecnyOption) {
  return {
    id: CurrecnyOption.getAttribute("value"),
    code: CurrecnyOption.getAttribute("code"),
    rate: CurrecnyOption.getAttribute("rate"),
  };
}

FetchAllCurrencies();

async function FetchAllCurrencies() {
  EnableElements(false);

  let data;

  try {
    data = await fetch("https://localhost:7203/api/Currencies/GetCurrencies");
  } catch (error) {
    return;
  }

  let CurrenciesList = await data.json();

  if (CurrenciesList.length > 0) {
    EnableElements();

    FillSelects(CurrenciesList);

    CurrenciesRows = document.querySelectorAll(".currencies-page tbody tr");
  }
}

function EnableElements(enable = true) {
  if (enable) {
    fromInput.removeAttribute("disabled");
    fromSelect.removeAttribute("disabled");
    toInput.removeAttribute("disabled");
    toSelect.removeAttribute("disabled");
  } else {
    fromInput.setAttribute("disabled", "");
    fromSelect.setAttribute("disabled", "");
    toInput.setAttribute("disabled", "");
    toSelect.setAttribute("disabled", "");
  }
}

function FillSelects(CurrenciesList) {
  CurrenciesList.forEach((Currency) => {
    CreateCurrencyOption(Currency);
  });

  toSelect.innerHTML = fromSelect.innerHTML;

  //   console.log(fromSelect.options[fromSelect.selectedIndex]);
  //   console.log(toSelect.options[toSelect.selectedIndex]);

  fromSelect.selectedIndex = 138;
  toSelect.selectedIndex = 58;

  fromObj = GetCurrencyObj(fromSelect.options[fromSelect.selectedIndex]);
  toObj = GetCurrencyObj(toSelect.options[toSelect.selectedIndex]);

  ChangeText();

  fromSelect.addEventListener("input", SelectCurrency);
  toSelect.addEventListener("input", SelectCurrency);
}

function CreateCurrencyOption(Currency) {
  fromSelect.innerHTML += `
  <option value=${Currency.id} rate=${Currency.rate} code = ${Currency.code}>${
    Currency.code + " - " + Currency.name
  }</option>
  `;
}

function ChangeText() {
  let result = +(toObj.rate / fromObj.rate).toFixed(9);
  fromTxt.textContent = `1 ${fromObj.code} = ${result} ${toObj.code}`;

  result = +(fromObj.rate / toObj.rate).toFixed(9);
  toTxt.textContent = `1 ${toObj.code} = ${result} ${fromObj.code}`;
}

function SelectCurrency() {
  // if (fromSelect.selectedIndex == -1 || toSelect.selectedIndex == -1) return;

  fromObj = GetCurrencyObj(fromSelect.options[fromSelect.selectedIndex]);
  toObj = GetCurrencyObj(toSelect.options[toSelect.selectedIndex]);

  ChangeText();

  insertAmount();
}

fromInput.addEventListener("input", insertAmount);

toInput.addEventListener("input", insertAmount);

function insertAmount() {
  isFrom = window.event.target.parentElement.getAttribute("class") == "from";
  if (isFrom) {
    let fromRate = fromObj.rate;
    let toRate = toObj.rate;
    let amount = fromInput.value;

    let result = ConvertFromToCurrency(fromRate, toRate, amount);

    result.toString().includes("e")
      ? (toInput.value = 0)
      : (toInput.value = result);
  } else {
    let fromRate = toObj.rate;
    let toRate = fromObj.rate;
    let amount = toInput.value;

    let result = ConvertFromToCurrency(fromRate, toRate, amount);

    result.toString().includes("e")
      ? (fromInput.value = 0)
      : (fromInput.value = result);
  }
}

function ConvertFromToCurrency(fromRate, toRate, amount) {
  let amountInUSD = amount / fromRate;
  let result = toRate * amountInUSD;

  return +result.toFixed(9);
}

fromInput.addEventListener("keypress", (e) => {
  ValidChar(e);
});

toInput.addEventListener("keypress", (e) => {
  ValidChar(e);
});

function ValidChar(e) {
  // console.log(toInput.value, e.key);
  if (isNaN(e.key) && e.key != ".") e.preventDefault();
}
