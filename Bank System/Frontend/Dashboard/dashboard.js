let TotalClients = document.querySelector(".TotalClients");
let TotalTransfers = document.querySelector(".TotalTransfers");
let TotalCurrencies = document.querySelector(".TotalCurrencies");

LoadData();

function LoadData() {
  FetchTotalClients();
  FetchTotalTransfers();
  FetchTotalTotalCurrenciess();
}

async function FetchTotalClients() {
  let data;

  try {
    data = await fetch("http://bsp.runasp.net/api/Clients/GetTotalClients");
  } catch (error) {
    return;
  }

  let total = (await data.json()).total;

  TotalClients.textContent = total;
}

async function FetchTotalTransfers() {
  let data = await fetch(
    "http://bsp.runasp.net/api/Transfers/GetTotalTransfers"
  );
  let total = (await data.json()).total;

  TotalTransfers.textContent = total;
}

async function FetchTotalTotalCurrenciess() {
  let data = await fetch(
    "http://bsp.runasp.net/api/Currencies/GetTotalCurrencies"
  );
  let total = (await data.json()).total;

  TotalCurrencies.textContent = total;
}
