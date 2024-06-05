let Overlay = document.querySelector(".overlay");
let ResponsiveTable = document.querySelector(
  ".currencies-table .responsive-table"
);

let CurrencyCard = document.querySelector(".currency-card");
let CloseBtn = document.querySelector(".currency-card .close-btn");

let NameLable = document.querySelector(".currency-card .name");
let CodeLable = document.querySelector(".currency-card .code");
let RateLable = document.querySelector(".currency-card .rate");

let SelectElement = document.querySelector(".currencies-page select");
let SearchInput = document.querySelector(".currencies-page input");
let OperationsMenu = document.querySelector(".Currencies-page .OperationsMenu");
let CurrenciesTableBody = document.querySelector(".currencies-page tbody");

let CurrenciesRows;

let Currency = {};

Overlay.addEventListener("click", (e) => {
  if (CurrencyCard.classList.contains("show")) {
    CurrencyCard.classList.remove("show");
    Overlay.classList.remove("show");
  }
});

CloseBtn.addEventListener("click", (_) => {
  CurrencyCard.classList.remove("show");
  Overlay.classList.remove("show");
});

FetchAllCurrencies();

async function FetchAllCurrencies() {
  EnableElements(false);

  ResponsiveTable.classList.add("loading");

  let data;
  try {
    data = await fetch("https://localhost:7203/api/Currencies/GetCurrencies");
  } catch (error) {
    return;
  } finally {
    ResponsiveTable.classList.remove("loading");
  }

  let CurrenciesList = await data.json();
  
  if (CurrenciesList.length > 0) {
    EnableElements();

    FillCurrenciesTable(CurrenciesList);

    CurrenciesRows = document.querySelectorAll(".currencies-page tbody tr");
  }
}

function EnableElements(enable = true) {
  if (enable) {
    SelectElement.removeAttribute("disabled");
    SearchInput.removeAttribute("disabled");
  } else {
    SelectElement.setAttribute("disabled", "");
    SearchInput.setAttribute("disabled", "");
  }
}

function FillCurrenciesTable(CurrenciesList) {
  CurrenciesList.forEach((Currency) => {
    CreateCurrencyRow(Currency);
  });
}

function CreateCurrencyRow(Currency) {
  CurrenciesTableBody.innerHTML += `
      <tr>
        <td class="showbtn" onclick="ShowCurrency(${Currency.id})" >
        Show
        </td>
        <td data-filterValue="Id">${Currency.id}</td>
        <td data-filterValue="Name">${Currency.name}</td>
        <td data-filterValue="Code">${Currency.code}</td>
        <td data-filterValue="Code">${Currency.rate}</td>
      </tr>
  `;
}

SelectElement.addEventListener("input", (_) => {
  SearchInput.setAttribute("placeholder", `Search By ${SelectElement.value}`);
  OnInput();
});

SearchInput.addEventListener("input", OnInput);

function OnInput() {
  let value = SearchInput.value.trim().toLowerCase();

  filterCurrencies(value);
}

function filterCurrencies(value) {
  CurrenciesRows.forEach((row) => {
    if (value == "") {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
      let cellValue = [...row.children]
        .filter((td) => {
          return td.dataset.filtervalue == SelectElement.value;
        })[0]
        .textContent.toLowerCase();

      let re = new RegExp(`\\b${value}`, "gi");

      if (re.test(cellValue.trim().split(" ")[0])) {
        row.style.display = "table-row";
      }
    }
  });
}

function ShowCurrency(CurrencyId) {
  LoadCurrencyInfo(CurrencyId, false);
  Overlay.classList.add("show");
  CurrencyCard.classList.add("show");
}

async function LoadCurrencyInfo(CurrencyId) {
  let data = await fetch(
    `https://localhost:7203/api/Currencies/GetCurrencyById/${CurrencyId}`
  );

  Currency = await data.json();

  FillLabels(Currency);
}

function FillLabels(Currency) {
  NameLable.textContent = Currency.currencyName;
  CodeLable.textContent = Currency.currencyCode;
  RateLable.textContent = Currency.rate;
}
