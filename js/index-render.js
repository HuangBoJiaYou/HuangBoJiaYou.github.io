function renderMonth(){
    const sltStartMonth = document.getElementById("slt-start-month");
    const sltEndtMonth = document.getElementById("slt-end-month");

    for(let i = 1; i <= 12; i++){
        const option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        sltStartMonth.appendChild(option);
    }
    for(let i = 1; i <= 12; i++){
        const option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        sltEndtMonth.appendChild(option);
    }
}

function renderDay(){
    const startMonthValue = +document.getElementById("slt-start-month").value;
    const endMonthValue = +document.getElementById("slt-end-month").value;

    const sltStartDay = document.getElementById("slt-start-day");
    const sltEndtDay = document.getElementById("slt-end-day");

    let startDayMax
    if(startMonthValue === 2){
        startDayMax = 28;
    } else if([1,3,5,7,8,10,12]){
        startDayMax = 31;
    } else {
        startDayMax = 30;
    }

    let endDayMax
    if(endMonthValue === 2){
        endDayMax = 28;
    } else if([1,3,5,7,8,10,12]){
        endDayMax = 31;
    } else {
        endDayMax = 30;
    }

    for(let i = 1; i <= startDayMax; i++){
        const option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        sltStartDay.appendChild(option);
    }
    for(let i = 1; i <= endDayMax; i++){
        const option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        sltEndtDay.appendChild(option);
    }

}

function actStartMonthChange(){
    const startMonthValue = +document.getElementById("slt-start-month").value;
    const sltStartMonth = document.getElementById("slt-start-month");

      sltStartMonth.addEventListener("change", (e) => {
          const sltStartDay = document.getElementById("slt-start-day");

          let startDayMax
          if(startMonthValue === 2){
              startDayMax = 28;
          } else if([1,3,5,7,8,10,12].includes(startMonthValue)){
              startDayMax = 31;
          } else {
              startDayMax = 30;
          }

          for(let i = 1; i <= startDayMax; i++) {
              const option = document.createElement("option");
              option.value = i;
              option.innerHTML = i;
              sltStartDay.appendChild(option);
          }
      })
}

renderMonth();
renderDay();