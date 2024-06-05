// void(0) is just a short and simple script that evaluates to undefined.

let Overlay = document.querySelector(".overlay");
let ResponsiveTable = document.querySelector(
  ".clients-table .responsive-table"
);

let ClientCard = document.querySelector(".client-card");
let CardTitle = document.querySelector(".client-card .title");
let CancelUpdateButton = document.querySelector(".client-card .cancelbtn");
let SaveButton = document.querySelector(".client-card .savebtn");

let firstNameInput = document.querySelector(".client-card .firstname");
let lastNameInput = document.querySelector(".client-card .lastname");
let emailInput = document.querySelector(".client-card .email");
let phoneInput = document.querySelector(".client-card .phone");
let dateOfBirthInput = document.querySelector(".client-card .date");

let ClientInfo = document.querySelector(".client-info");
let CloseBtn = document.querySelector(".client-info .close-btn");

let clientIdLable = document.querySelector(".client-info .client-id");
let pinCodeLable = document.querySelector(".client-info .pincode");
let firstNameLable = document.querySelector(".client-info .firstname");
let lastNameLable = document.querySelector(".client-info .lastname");
let emailLable = document.querySelector(".client-info .email");
let phoneLable = document.querySelector(".client-info .phone");
let dateOfBirthLable = document.querySelector(".client-info .date-of-birth");

let AddClientBtn = document.querySelector(".clients-page .add-client-btn");
let SelectElement = document.querySelector(".clients-page select");
let SearchInput = document.querySelector(".clients-page input");
let OperationsMenu = document.querySelector(".clients-page .OperationsMenu");
let ClientsTableBody = document.querySelector(".clients-page tbody");

let ClientsRows;

let client = {};

let CheckShow = true;

Overlay.addEventListener("click", (e) => {
  if (ClientInfo.classList.contains("show")) {
    ClientInfo.classList.remove("show");
    Overlay.classList.remove("show");
  }
});

CloseBtn.addEventListener("click", (_) => {
  CheckShow = true;
  ClientInfo.classList.remove("show");
  Overlay.classList.remove("show");
});

let inputs = [
  firstNameInput,
  lastNameInput,
  emailInput,
  phoneInput,
  dateOfBirthInput,
];

ClearInputs();

FetchAllClients();

async function FetchAllClients() {
  EnableElements(false);

  ResponsiveTable.classList.add("loading");

  let data;

  AddClientBtn.setAttribute("disabled", "");

  try {
    data = await fetch("https://bsp.runasp.net/api/Clients/GetClients");
  } catch (error) {
    return;
  } finally {
    ResponsiveTable.classList.remove("loading");
  }

  AddClientBtn.removeAttribute("disabled");

  let ClientsList = await data.json();
  if (ClientsList.length > 0) {
    FillClientsTable(ClientsList);

    ClientsRows = document.querySelectorAll(".clients-page tbody tr");

    ClientsRows.forEach((row) => {
      row.addEventListener("click", () => {
        if (CheckShow) {
          ShowClient(row.children[1].textContent);
        }
      });
    });
    EnableElements();
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

function FillClientsTable(ClientsList) {
  ClientsList.forEach((client) => {
    CreateClientRow(client);
  });
}

function CreateClientRow(Client) {
  ClientsTableBody.innerHTML += `
      <tr>
        <td class="dropdown">
          <a href="javascript:void(0)" class="dropbtn">Hover</a>
          <ul class="dropdown-content">
            <li class="showbtn" onclick="ShowClient(${Client.clientId})">
              Show
            </li>
            <li class="updatebtn" onclick="ClickUpdateBtn(${Client.clientId})">
              Update
            </li>
            <li class="deletebtn" onclick="ClickDeleteBtn(${Client.clientId})">
              Delete
            </li>
          </ul>
        </td>
        <td data-filterValue="Client Id">${Client.clientId}</td>
        <td>${Client.pinCode}</td>
        <td data-filterValue="First Name">${Client.firstName}</td>
        <td data-filterValue="Last Name">${Client.lastName}</td>
        <td>${Client.balance}</td>
        <td>${Client.email}</td>
        <td>${Client.phone}</td>
        <td>${Client.dateOfBirth}</td>
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

  filterClients(value);
}

function filterClients(value) {
  ClientsRows.forEach((row) => {
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

function ClearInputs() {
  dateOfBirthInput.value = dateOfBirthInput.max = new Date(Date.now())
    .toISOString()
    .split("T")[0];

  firstNameInput.value =
    lastNameInput.value =
    emailInput.value =
    phoneInput.value =
      "";

  let labls = document.querySelectorAll(".container-form .card p");
  labls.forEach((label) => {
    label.remove();
  });
}

function ShowClient(clientId) {
  LoadClientInfo(clientId, false);
  Overlay.classList.add("show");
  ClientInfo.classList.add("show");
}

function ClickUpdateBtn(clientId) {
  CheckShow = false;
  LoadClientInfo(clientId);
  Overlay.classList.add("show");
  ClientCard.classList.add("show");
  SaveButton.dataset.role = "update";
  CardTitle.textContent = "Update Client";
}

async function LoadClientInfo(clientId, UpdateMode = true) {
  let data = await fetch(
    `https://bsp.runasp.net/api/Clients/GetClientById/${clientId}`
  );

  client = await data.json();

  UpdateMode ? FillInputs(client) : FillLabels(client);
}

function FillInputs(client) {
  firstNameInput.value = client.firstName;
  lastNameInput.value = client.lastName;
  emailInput.value = client.email;
  phoneInput.value = client.phone;
  let date = new Date(client.dateOfBirth);
  date.setHours(3); // +3 GMt

  dateOfBirthInput.value = date.toISOString().split("T")[0];
}

function FillLabels(client) {
  clientIdLable.textContent = client.clientId;
  pinCodeLable.textContent = client.pinCode;
  firstNameLable.textContent = client.firstName;
  lastNameLable.textContent = client.lastName;
  emailLable.textContent = client.email;
  phoneLable.textContent = client.phone;
  let date = new Date(client.dateOfBirth);
  date.setHours(3); // +3 GMt

  dateOfBirthLable.textContent = date.toISOString().split("T")[0];
}

CancelUpdateButton.addEventListener("click", (e) => {
  CheckShow = true;
  e.preventDefault();
  Overlay.classList.remove("show");
  ClientCard.classList.remove("show");
  ClearInputs();
});

SaveButton.addEventListener("click", async (e) => {
  CheckShow = true;

  e.preventDefault();

  if (!Validation()) return;

  let result = await SaveClientInfo();

  alert(result ? "Data Was Saved successfully" : "Data Was Not Saved");

  location.reload();
});

inputs.forEach((input) => {
  input.addEventListener("blur", () => {
    let value = input.value.trim();

    let type = input.className;
    let check = false;

    if (value.length == 0) check = true;
    else if (type == "firstname" || type == "lastname") {
      if (ValidName(input.value.trim())) check = true;
    } else if (type == "phone") {
      if (input.value.trim().length > 13) check = true;
    }

    if (check && input.nextElementSibling == null)
      createLabelForInput(input.parentElement);
    else if (!check) input.nextElementSibling?.remove();
  });
});

function Validation() {
  inputs.forEach((input) => {
    input.dispatchEvent(new CustomEvent("blur"));
  });

  let errors = document.querySelectorAll(".container-form .card p");
  return errors.length == 0;
}

function ValidName(value) {
  return /[^A-Z]/gi.test(value);
}

function createLabelForInput(parentInput) {
  let label = document.createElement("p");
  let ContentLable = document.createTextNode(
    parentInput.children[0].getAttribute("text")
  );
  label.append(ContentLable);
  parentInput.append(label);
}

async function SaveClientInfo() {
  let RoleSaveBtn = SaveButton.dataset.role;

  client.firstName = firstNameInput.value.trim();
  client.lastName = lastNameInput.value.trim();
  client.email = emailInput.value.trim();
  client.phone = phoneInput.value.trim();
  client.dateOfBirth = dateOfBirthInput.value.trim();

  let data;

  if (RoleSaveBtn == "add") {
    data = await fetch("https://bsp.runasp.net/api/Clients/AddClient", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(client),
    });
  } else {
    data = await fetch("https://bsp.runasp.net/api/Clients/UpdateClient", {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(client),
    });
  }

  return (await data.json()).isSaved;
}

async function AddClientInfo() {}

AddClientBtn.addEventListener("click", (e) => {
  SaveButton.dataset.role = "add";
  Overlay.classList.add("show");
  ClientCard.classList.add("show");
  CardTitle.textContent = "Add Client";
});

async function ClickDeleteBtn(clientId) {
  CheckShow = false;
  let ClickYes = confirm(`Are you Shure Delete Client Id ${clientId} ?!`);

  if (ClickYes) {
    await DeleteClient(clientId);
    location.reload();
  }
}

async function DeleteClient(clientId) {
  await fetch(`https://bsp.runasp.net/api/Clients/DeleteClient/${clientId}`, {
    method: "delete",
  });

  // let result = await data.json();
}
