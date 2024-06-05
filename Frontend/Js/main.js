let SiderbarItems = document.querySelectorAll(".sidebar ul .dropMenu");

SiderbarItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    item.classList.toggle("show");
  });
});

// let WithdrawBtn = document.querySelector(".page .sidebar .dropMenu .withdraw");

// WithdrawBtn.addEventListener("click", () => {
//   document.querySelector(".page .content > h1").textContent = "Withdraw";
// });
