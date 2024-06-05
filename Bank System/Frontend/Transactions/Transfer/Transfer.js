let ResponsiveTable = document.querySelector(
  ".clients-table .responsive-table"
);
let SearchInput = document.querySelector(".transfer-page input");
let ClientsTableBody = document.querySelector(".transfer-page tbody");
let FromClientInput = document.querySelector(
  ".transfer-footer .from-client input"
);
let AmountInput = document.querySelector(".transfer-footer .amount input");
let ToClientInput = document.querySelector(".transfer-footer .to-client input");
let TransferBtn = document.querySelector(".transfer-page .transfer-btn");
let ErrorMesssage = document.querySelector(".transfer-page .error");

let ClientsRows;

FetchAllClients();

async function FetchAllClients() {
  EnableElements(false);

  ResponsiveTable.classList.add("loading");

  let data;

  try {
    data = await fetch("https://bsp.runasp.net/api/Clients/GetClients");
  } catch (error) {
    return;
  } finally {
    ResponsiveTable.classList.remove("loading");
  }

  let ClientsList = await data.json();

  if (ClientsList.length > 0) {
    EnableElements();

    FillClientsTable(ClientsList);

    ClientsRows = document.querySelectorAll(".transfer-page tbody tr");
  }
}

function EnableElements(enable = true) {
  if (enable) {
    SearchInput.removeAttribute("disabled");
    TransferBtn.removeAttribute("disabled");
    AmountInput.removeAttribute("disabled");
    FromClientInput.removeAttribute("disabled");
    ToClientInput.removeAttribute("disabled");
  } else {
    SearchInput.setAttribute("disabled", "");
    TransferBtn.setAttribute("disabled", "");
    AmountInput.setAttribute("disabled", "");
    FromClientInput.setAttribute("disabled", "");
    ToClientInput.setAttribute("disabled", "");
  }
}

function FillClientsTable(ClientsList) {
  ClientsList.forEach((client) => {
    CreateClientRow(client);
  });
}

function CreateClientRow(Client) {
  ClientsTableBody.innerHTML += `
      <tr>
        <td data-filterValue="Client Id">${Client.clientId}</td>
        <td>${Client.firstName + " " + Client.lastName}</td>
        <td>${Client.balance}</td>
      </tr>
  `;
}

SearchInput.addEventListener("input", OnInput);

function OnInput() {
  let value = SearchInput.value.trim().toLowerCase();

  filterClients(value);
}

function filterClients(value) {
  ClientsRows.forEach((row) => {
    if (value == "") {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
      let clientId = row.children[0].textContent;

      let re = new RegExp(`\\b${value}`, "gi");

      if (re.test(clientId.trim().split(" ")[0])) {
        row.style.display = "table-row";
      }
    }
  });
}

let maxWithdraw;

TransferBtn.addEventListener("click", async (_) => {
  let FromClientId = +FromClientInput.value;
  let ToClientId = +ToClientInput.value;
  let amount = +AmountInput.value;
  let minWithdraw = AmountInput.min;

  if (FromClientId == ToClientId) {
    ErrorMesssage.textContent =
      "From Client Id Must Be Different From To Client Id!";
    ErrorMesssage.classList.add("show");
  } else if (!IsValidId(FromClientId, ToClientId)) {
    ErrorMesssage.textContent = "Please Select A Valid Client";
    ErrorMesssage.classList.add("show");
  } else if (maxWithdraw < minWithdraw) {
    ErrorMesssage.textContent = `Don't have Enough Balacne`;
    ErrorMesssage.classList.add("show");
  } else if (amount < minWithdraw || amount > maxWithdraw) {
    ErrorMesssage.textContent = `Amount Must Be In Range ${AmountInput.min} - ${AmountInput.max}`;
    ErrorMesssage.classList.add("show");
  } else {
    ErrorMesssage.classList.remove("show");
    let result = await transfer(FromClientId, ToClientId, amount);
    alert(result ? "Data Was Saved successfully" : "Data Was Not Saved");
    location.reload();
  }
});

function IsValidId(fromClientId, toClientId) {
  if (fromClientId == 0 || toClientId == 0) return false;

  let clientsId = [
    ...document.querySelectorAll(".transfer-page tbody tr td:first-child"),
  ];

  let Ids = clientsId.filter((Id, i) => {
    if (+Id.textContent == fromClientId) rowIndex = i;

    return +Id.textContent == fromClientId || +Id.textContent == toClientId;
  });

  if (Ids.length == 2) {
    AmountInput.max = ClientsRows[rowIndex].children[2].textContent;
    maxWithdraw = AmountInput.max;
  }

  return Ids.length == 2;
}

async function transfer(fromClientId, toClientId, amount) {
  let data = await fetch(
    `https://bsp.runasp.net/api/Clients/Transfer/${fromClientId}/${toClientId}`,
    {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(amount),
    }
  );

  return (await data.json()).isUpdated;
}
