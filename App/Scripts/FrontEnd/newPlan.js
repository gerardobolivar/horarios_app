export default function NewPlan() {
  let planTitle = document.getElementById("planTitle");
  planTitle.focus();
  
  planTitle.addEventListener("click", () => {
    planTitle.style.width = "90%";
  });

  planTitle.addEventListener("blur", () => {
    planTitle.style.width = "50%";
  });



  //planTitle.addEventListener("change", () => {
 // });
}
