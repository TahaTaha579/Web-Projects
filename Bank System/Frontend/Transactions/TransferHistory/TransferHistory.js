// void(0) is just a short and simple script that evaluates to undefined.

let ResponsiveTable = document.querySelector(".responsive-table");
let SelectElement = document.querySelector(".transfers-history-page select");
let SearchInput = document.querySelector(".transfers-history-page input");
let OperationsMenu = document.querySelector(
  ".transfers-history-table .OperationsMenu"
);
let TransfersTableBody = document.querySelector(
  ".transfers-history-table tbody"
);

let TransfersRows;

let Transfer = {};

FetchAllTransfers();

async function FetchAllTransfers() {
  EnableElements(false);

  ResponsiveTable.classList.add("loading");

  let data;

  try {
    data = await fetch(
      "https://localhost:7203/api/Transfers/GetTransfersHistory"
    );
  } catch (error) {
    return;
  } finally {
    ResponsiveTable.classList.remove("loading");
  }

  let TransfersList = await data.json();

  if (TransfersList.length > 0) {
    EnableElements();
    ResponsiveTable.classList.remove("loading");

    FillTransfersTable(TransfersList);

    TransfersRows = document.querySelectorAll(
      ".transfers-history-table tbody tr"
    );

    SearchInput.removeAttribute("disabled");
    SelectElement.removeAttribute("disabled");
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

function FillTransfersTable(TransfersList) {
  TransfersList.forEach((Transfer) => {
    CreateTransferRow(Transfer);
  });
}

function CreateTransferRow(Transfer) {
  TransfersTableBody.innerHTML += `
      <tr>
        <td data-filterValue="Transfer Id">${Transfer.transferId}</td>
        <td data-filterValue="From Client">${Transfer.fromClient}</td>
        <td data-filterValue="To Client">${Transfer.toClient}</td>
        <td>${Transfer.amount}</td>
        <td>${Transfer.date}</td>
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

  filterTransfers(value);
}

function filterTransfers(value) {
  TransfersRows.forEach((row) => {
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
