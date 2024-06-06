let TotalClients = document.querySelector(".TotalClients");
let TotalTransfers = document.querySelector(".TotalTransfers");
let TotalCurrencies = document.querySelector(".TotalCurrencies");

LoadData();

async function LoadData() {

  await Promise.all([
    FetchTotalClients(),
    FetchTotalTransfers(),
    FetchTotalTotalCurrencies(),
  ]);
}


async function FetchTotalClients() {
  let data;

  try {
    data = await fetch("https://bsp.runasp.net/api/Clients/GetTotalClients");
  } catch (error) {
    return;
  }

  let total = (await data.json()).total;

  TotalClients.textContent = total;
}

async function FetchTotalTransfers() {
  let data = await fetch(
    "https://bsp.runasp.net/api/Transfers/GetTotalTransfers"
  );
  let total = (await data.json()).total;

  TotalTransfers.textContent = total;
}

async function FetchTotalTotalCurrencies() {
    fetch("https://bsp.runasp.net/api/Currencies/GetTotalCurrencies")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      TotalCurrencies.textContent = res.total;
    });
}
