async function fetchStockData() {
    const response = await fetch('../data/contracts/all_cp.json');
    const data = await response.json();
    console.log(data)
    return data;
  }
  
  async function active_volume_tickertape() {
    const rowData = await fetchStockData();
    const highVolumeStocks = rowData.filter(stock => stock.total_vol > 2 * stock.avg_vol);
    const scroller = document.getElementById("vol_tape");
    
    scroller.innerHTML = ""; // Clear existing content
    
    highVolumeStocks.forEach(stock => {
      const div = document.createElement("div");
      div.className = "scroller__item";
      div.textContent = `$${stock.stock.toUpperCase()}`;
  
      const call_change = stock.call_vol_pct_chng;
      const put_change = stock.put_vol_pct_chng;
  
      if (call_change > 0) {
        div.style.color = "green";
        div.innerHTML += " &#9650;"; // Upward arrow symbol (Unicode)
      } else if (put_change > 0) {
        div.style.color = "red";
        div.innerHTML += " &#9660;"; // Downward arrow symbol (Unicode)
      } else {
        div.style.color = "red";
      }
  
      scroller.appendChild(div);
    });
  }
  
  document.addEventListener("DOMContentLoaded", active_volume_tickertape);
  