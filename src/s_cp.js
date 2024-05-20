// Grid API: Access to Grid API methods
// let gridApi;

// Rounding Function 
function round(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

// Grid Options: Contains all of the grid configurations
const gridOptions = {
  // Data to be displayed
  rowData: [],
  // Columns to be displayed (Should match rowData properties)
  columnDefs: [
    {
        field: 'stock',
        sortable: true,
        headerName: 'Stock',
        valueFormatter: function(params) {
          return "$" + params.value.toUpperCase();
        },
        maxWidth: 95,
        pinned: 'left',
        lockPinned: true,
        cellClass: 'lock-pinned'
    },
    {
        field: 'total_vol',
        sortable: true,
        headerName: 'Total Volume',
        valueFormatter: function(params) {
          return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        maxWidth: 110,
    },
    {
        field: 'avg_vol',
        sortable: true,
        headerName: 'AvgVol(30D)',
        valueFormatter: function(params) {
          return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        maxWidth: 110,
    },
    {
      field:'call_vol',
      sortable: true,
      headerName: 'Call Volume',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      maxWidth: 110,
    },
    {
      field: 'call_vol_chng',
      sortable: true,
      headerName: 'Call Vol Chng', 
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      maxWidth: 110,
    },
    {
      field:'put_vol',
      sortable: true,
      headerName: 'Put Volume',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      maxWidth: 120,
    },
    {
      field: 'put_vol_chng',
      sortable: true,
      headerName: 'Put Vol Chng', 
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      maxWidth: 120,
    },
    {
        field: 'call_vol_pct',
        sortable: true,
        headerName: 'Call %',
        valueFormatter: function(params) {
            return round(100 * params.value) + "%";
        },
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        maxWidth: 100,
    },
    {
        field: 'put_vol_pct',
        sortable: true,
        headerName: 'Put %',
        valueFormatter: function(params) {
          return round(100 * params.value) + "%";
        },
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        maxWidth: 100,
    },
    {
      field: 'call_vol_pct_chng',
      sortable: true,
      headerName: '🟢CHNG',
      hide: false,
      valueFormatter: function(params) {
        return params.value > 0 ? "↑ " + round(100 * params.value) + "%" : "↓ " + round(100 * params.value) + "%";
      },
      cellStyle: function(params) {
        return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
      },
      maxWidth: 100,
    },
    {
        field: 'put_vol_pct_chng',
        sortable: true,
        headerName: '🔴CHNG',
        hide: false,
        valueFormatter: function(params) {
            return params.value > 0 ? "↑ " +  round(100 * params.value) + "%" : "↓ " + round(100 * params.value) + "%";
        },
        cellStyle: function(params) {
          return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
        },
        maxWidth: 100,
    }
    ]
  ,
};

// Create Grid: Create new grid within the #myGrid div, using the Grid Options object
volGrid = agGrid.createGrid(document.querySelector("#volume_grid"), gridOptions);

// Fetch Remote Data
fetch("data/vol_cp.json")
.then((response) => response.json())
.then((data) => volGrid.setGridOption("rowData", data))
.then(() => volGrid.applyColumnState({state: [{colId: 'total_vol',sort: 'desc',}],defaultState: { sort: null }}));

// Return the stocks that have a higher total volume than the average volume
function getHighVolumeStocks() {
  // Get the rowData from the grid
  const rowData = volGrid.getGridOption("rowData");
  // Filter the rowData to only include stocks with a higher total volume than the average volume
  const highVolumeStocks = rowData.filter((stock) => stock.total_vol > 2 * stock.avg_vol);
  // Print the stocks to the object with id = stocks
    // return only the stock name; add $ and convert to uppercase
    const stockNames = highVolumeStocks.map(stock => "$" + stock.stock.toUpperCase());
    // document.getElementById("highvol").innerText = stockNames.join(", ");
    // Update the grid to show only the high volume stocks
    volGrid.setGridOption("rowData", highVolumeStocks);
    volGrid.applyColumnState({state: [{colId: 'total_vol',sort: 'desc',}],defaultState: { sort: null }});

    // // Append the High Volume Stocks to the scroller. Add class="scroller__item" to each div with the stock name
    // const scroller = document.getElementById("tickertape");
    // scroller.innerHTML = "";
    // stockNames.forEach((stock) => {
    //   const div = document.createElement("div");
    //   div.className = "scroller__item";
    //   div.innerText = stock;
    //   scroller.appendChild(div);
    // });



    return stockNames;
}

function sortcallvol(){
    volGrid.applyColumnState({state: [{colId: 'call_vol_pct_chng',sort: 'desc',}],defaultState: { sort: null }});
}

function sortputvol(){
    volGrid.applyColumnState({state: [{colId: 'put_vol_pct_chng',sort: 'desc',}],defaultState: { sort: null }});
}

function resetVolume(){
    fetch("data/vol_cp.json")
        .then((response) => response.json())
        .then((data) => volGrid.setGridOption("rowData", data));
        // document.getElementById("resetvol").innerText = "";
}


const columnDefsOi = [
    {
      field: 'stock',
      sortable: true,
      headerName: 'Stock',
      valueFormatter: function(params) {
        return "$" + params.value.toUpperCase();
      },
      pinned: 'left',
      lockPinned: true,
      cellClass: 'lock-pinned',
      maxWidth: 95,
    },
    {
      field: 'total_oi',
      sortable: true,
      headerName: 'Total Open Interest',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      filter: "agNumberColumnFilter",
      filterValueGetter: function(params) {
        return params.value; // Removed extra parenthesis
      },
      filterParams: {
        filterOptions: ['lessThan', 'greaterThan', 'inRange']
      },
      editable: true,
      maxWidth: 110,
    },
    {
      field: 'avg_oi',
      sortable: true,
      headerName: 'AvgOI(30D)',
      valueFormatter: function(params) {
        return params.value !== null ? params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
      },
      maxWidth: 110,
      hide: false,
    },
    {
      field: 'call_oi',
      sortable: true,
      headerName: 'Call OI',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      maxWidth: 120,
    },
    {
      field: 'call_oi_chng',
      sortable: true,
      headerName: 'Call OI Chng',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      maxWidth: 120,
    },
    {
      field: 'put_oi',
      sortable: true,
      headerName: 'Put OI',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      maxWidth: 110,
    },
    {
      field: 'put_oi_chng',
      sortable: true,
      headerName: 'Put OI Chng',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      maxWidth: 120,
    },
    {
      field: 'call_oi_pct',
      sortable: true,
      headerName: 'Call %',
      valueFormatter: function(params) {
        return round(100 * params.value) + "%";
      },
      maxWidth: 95,
    },
    {
      field: 'put_oi_pct',
      sortable: true,
      headerName: 'Put %',
      valueFormatter: function(params) {
        return round(100 * params.value) + "%";
      },
      maxWidth: 95,
    },
    {
      field: 'call_oi_pct_chng',
      sortable: true,
      headerName: '🟢Change',
      hide: false,
      valueFormatter: function(params) {
        return params.value > 0 ? "↑ " + round(100 * params.value) + "%" : "↓ " + round(100 * params.value) + "%";
      },
      cellStyle: function(params) {
        return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
      },
      maxWidth: 105,
    },
    {
      field: 'put_oi_pct_chng',
      sortable: true,
      headerName: '🔴Change',
      hide: false,
      valueFormatter: function(params) {
        return params.value > 0 ? "↑ " + round(100 * params.value) + "%" : "↓ " + round(100 * params.value) + "%";
      },
      cellStyle: function(params) {
        return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
      },
      maxWidth: 105,
    }
  ];

  
const grid_options_oi = {
    rowData: [],
    columnDefs: columnDefsOi
    };


oiGrid = agGrid.createGrid(document.querySelector("#oi_grid"), grid_options_oi);
fetch("data/oi_cp.json")
    .then((response) => response.json())
    .then((data) => oiGrid.setGridOption("rowData", data));



function getHighOpenInterestStocks(){
    const rowData = oiGrid.getGridOption("rowData");
    const highOIStocks = rowData.filter((stock) => stock.total_oi > 1.5 * stock.avg_oi);
    const stockNames = highOIStocks.map(stock => "$" + stock.stock.toUpperCase());
    oiGrid.setGridOption("rowData", highOIStocks);
    // return stockNames;
}

function sortcalloi(){
    oiGrid.applyColumnState({state: [{colId: 'call_oi_pct_chng',sort: 'desc',}],defaultState: { sort: null }});
}

function sortputoi(){
    oiGrid.applyColumnState({state: [{colId: 'put_oi_pct_chng',sort: 'desc',}],defaultState: { sort: null }});
}

function resetOpenInterest(){
    fetch("data/oi_cp.json")
        .then((response) => response.json())
        .then((data) => oiGrid.setGridOption("rowData", data));
}

async function active_volume_tickertape() {
  // Get the rowData from the grid
  getHighVolumeStocks();
  console.log("active_volume_tickertape");
  const rowData = volGrid.getGridOption("rowData");
  const highVolumeStocks = rowData.filter((stock) => stock.total_vol > 2 * stock.avg_vol);
  const scroller = document.getElementById("vol_tape");
  // Add a text to the left of the scroller
  scroller.innerHTML = "";
  // Loop through each stock and create the element
  highVolumeStocks.forEach((stock) => {
    const div = document.createElement("div");
    div.className = "scroller__item";

    // Set the stock name with a dollar sign
    div.textContent = `$${stock.stock.toUpperCase()}`;

    // Calculate the price change (assuming a 'change' property in stock)
    const call_change= stock.call_vol_pct_chng;
    const put_change= stock.put_vol_pct_chng;

    // Set the color and indicator based on price change
    if (call_change > 0) {
      div.style.color = "green";
      div.innerHTML += " &#9650;"; // Upward arrow symbol (Unicode)
    } else if (put_change > 0) {
      div.style.color = "red";
      div.innerHTML += " &#9660;"; // Downward arrow symbol (Unicode)
    } else {
      div.style.color = "red";
    }

    // Append the element to the scroller
    div.className = "scroller__item";
    scroller.appendChild(div);
  });
}

// document.addEventListener('DOMContentLoaded', active_volume_tickertape);
active_volume_tickertape();


