let ResponsiveTable = document.querySelector(
  ".clients-table .responsive-table"
);
let SearchInput = document.querySelector(".withdraw-page input");
let ClientsTableBody = document.querySelector(".withdraw-page tbody");
let ClientIdLable = document.querySelector(".withdraw-footer .client-id");
let AmountInput = document.querySelector(".withdraw-footer input");
let WithdrawBtn = document.querySelector(".withdraw-footer .withdraw-btn");
let ErrorMesssage = document.querySelector(".withdraw-page .error");

let ClientsRows;

FetchAllClients();

async function FetchAllClients() {
  EnableElements(false);

  ResponsiveTable.classList.add("loading");

  let data;

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

    ClientsRows = document.querySelectorAll(".withdraw-page tbody tr");
    SelectClientId();
  }
}

function EnableElements(enable = true) {
  if (enable) {
    SearchInput.removeAttribute("disabled");
    WithdrawBtn.removeAttribute("disabled");
    AmountInput.removeAttribute("disabled");
  } else {
    SearchInput.setAttribute("disabled", "");
    WithdrawBtn.setAttribute("disabled", "");
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
      AmountInput.max = row.children[2].textContent;
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

WithdrawBtn.addEventListener("click", async (_) => {
  let ClientId = ClientIdLable.textContent;
  let amount = +AmountInput.value;
  let minWithdraw = AmountInput.min;
  let maxWithdraw = AmountInput.max;

  if (+ClientId == 0) {
    ErrorMesssage.textContent = "Please Select A Client";
    ErrorMesssage.classList.add("show");
  } else if (maxWithdraw < minWithdraw) {
    ErrorMesssage.textContent = `Don't have Enough Balacne`;
    ErrorMesssage.classList.add("show");
  } else if (amount < minWithdraw || amount > maxWithdraw) {
    ErrorMesssage.textContent = `Amount Must Be In Range ${AmountInput.min} - ${AmountInput.max}`;
    ErrorMesssage.classList.add("show");
  } else {
    ErrorMesssage.classList.remove("show");
    let result = await withdraw(ClientId, amount);

    alert(result ? "Data Was Saved successfully" : "Data Was Not Saved");

    location.reload();
  }
});

async function withdraw(clientId, amount) {
  let data = await fetch(
    `https://localhost:7203/api/Clients/Withdraw/${clientId}`,
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
