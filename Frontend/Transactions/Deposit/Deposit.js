let ResponsiveTable = document.querySelector(".responsive-table");
let SearchInput = document.querySelector(".deposit-page input");
let ClientsTableBody = document.querySelector(".deposit-page tbody");
let ClientIdLable = document.querySelector(".deposit-footer .client-id");
let AmountInput = document.querySelector(".deposit-footer input");
let DepositBtn = document.querySelector(".deposit-footer .deposit-btn");
let ErrorMesssage = document.querySelector(".deposit-page .error");

let ClientsRows;

FetchAllClients();

async function FetchAllClients() {
  EnableElements(false);

  let data;

  ResponsiveTable.classList.add("loading");

  try {
    data = await fetch("https://localhost:7203/api/Clients/GetClients");
  } catch (error) {
    return;
  } finally {
    ResponsiveTable.classList.remove("loading");
  }

  let ClientsList = await data.json();
  
  if (ClientsList.length > 0) {
    EnableElements();

    FillClientsTable(ClientsList);

    ClientsRows = document.querySelectorAll(".deposit-page tbody tr");

    SelectClientId();
  }
}

function EnableElements(enable = true) {
  if (enable) {
    SearchInput.removeAttribute("disabled");
    DepositBtn.removeAttribute("disabled");
    AmountInput.removeAttribute("disabled");
  } else {
    SearchInput.setAttribute("disabled", "");
    DepositBtn.setAttribute("disabled", "");
    AmountInput.setAttribute("disabled", "");
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
        <td>${Client.pinCode}</td>
        <td>${Client.balance}</td>
      </tr>
  `;
}

function SelectClientId() {
  ClientsRows.forEach((row) => {
    row.addEventListener("click", (e) => {
      ClientIdLable.textContent = row.children[0].textContent;

      ErrorMesssage.classList.remove("show");
    });
  });
}

SearchInput.addEventListener("input", OnInput);

function OnInput() {
  let value = SearchInput.value.trim().toLowerCase();

  filterClients(value);

  ClientIdLable.textContent = 0;
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

DepositBtn.addEventListener("click", async (_) => {
  let ClientId = ClientIdLable.textContent;
  let amount = +AmountInput.value;

  if (+ClientId == 0) {
    ErrorMesssage.textContent = "Please Select A Client";
    ErrorMesssage.classList.add("show");
  } else if (amount < AmountInput.min || amount > AmountInput.max) {
    ErrorMesssage.textContent = `Amount Must Be In Range ${AmountInput.min} - ${AmountInput.max}`;
    ErrorMesssage.classList.add("show");
  } else {
    ErrorMesssage.classList.remove("show");
    let result = await Deposit(ClientId, amount);

    alert(result ? "Data Was Saved successfully" : "Data Was Not Saved");

    location.reload();
  }
});

async function Deposit(clientId, amount) {
  let data = await fetch(
    `https://localhost:7203/api/Clients/Deposit/${clientId}`,
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
