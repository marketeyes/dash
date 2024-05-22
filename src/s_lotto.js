
// Rounding Function 
function round(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

const columnDefsLottos = [
    {
      field: 'type',
      sortable: true,
      headerName: 'Type',
      pinned: "left",
      lockPinned: true,
      cellClass: 'lock-pinned',
      maxWidth: 75,
    },
    {
      field: 'contractsymbol',
      sortable: true,
      headerName: 'Contract Symbol',
      hide: true,
    },
    {
      field: 'stock',
      sortable: true,
      headerName: 'Stock',
      pinned: "left",
      lockPinned: true,
      cellClass: 'lock-pinned',
      maxWidth: 100,
    },
    {
      field: 'strike',
      sortable: true,
      headerName: 'Strike',
      maxWidth: 100,
      // Removed commented-out pinning options
    },
    {
      field: 'exp',
      sortable: true,
      headerName: 'Expiration',
      valueFormatter: params => params.value, // Simplified function for identity transform
      // Removed commented-out pinning options
      maxWidth: 125,
    },
    {
      field: 'lastprice',
      sortable: true,
      headerName: 'Last',
      valueFormatter: function(params) {
        return "$" + params.value.toFixed(2);
      },
      // Removed commented-out cell renderer
      maxWidth: 100,
    },
    {
      field: 'percentchange',
      headerName: '%CHNG',
      sortable: true,
      valueFormatter: function(params) {
        return params.value > 0 ? "↑ " + params.value.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%" : "↓ " + params.value.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%";
      },
      cellStyle: function(params) {
        return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
      },
      maxWidth: 120,
    },
    {
      field:'lastprice_avg_30d',
      headerName: 'AvgPrice',
      sortable: true,
      valueFormatter: function(params) {
        return "$" + params.value.toFixed(2);
      },
      maxWidth: 120,
    },
    {
      field: 'volume',
      headerName: 'Volume',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      // Removed commented-out cell renderer
      maxWidth: 150,
    },
    {
      field: 'vol_chg',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      hide: false,
      maxWidth: 120,
    },
    {
      field: 'voi',
      headerName: 'VOI',
      // valueFormatter: x => x.toFixed(2), // Arrow function for concise formatting
      hide: false,
      maxWidth: 120,
    },
    {
      field: 'openinterest',
      headerName: 'OI',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      maxWidth: 120,
    },
    {
      field: 'oi_chg',
      headerName: 'OI CHNG',
      hide: false,
      valueFormatter: function(params) {
        const formattedChange = params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return params.value > 0 ? "↑ " + formattedChange : "↓ " + formattedChange;
      },
      cellStyle: function(params) {
        return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
      },
      maxWidth: 160,
    },
    {
      field: 'change',
      headerName: '$ Change',
      sortable: true,
      valueFormatter: function(params) {
        return "$" + params.value.toFixed(2);
      },
      hide: true,
    },
    {
      field:'impliedvolatility', 
      headerName: 'IV',
      sortable: true,
      valueFormatter: function(params) {
        return params.value.toFixed(2) + "%";
      },
      hide: false,
      maxWidth: 100,
    },
    {
      field:'iv_avg_30d',
      headerName: 'AvgIV',
      sortable: true,
      valueFormatter: function(params) {
        return params.value.toFixed(2) + "%";
      },
      hide: false,
      maxWidth: 100,
    },
    {
      field: 'amnt',
      headerName: '???',
      sortable: true,
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      hide: false, 
      maxWidth: 110,
    }

];
 
  
const cgrid = {
    rowData:[], 
    columnDefs: columnDefsLottos,
};

lottosGrid = agGrid.createGrid(document.querySelector('#contracts_grid'), cgrid);

function reset_grid(){
    lottosGrid.setGridOption('rowData', []);
}

// Fetch data from the API
function getPercentMovers(){
    reset_grid();
    fetch('../data/contracts/pct.json')
        .then(response => response.json())
        .then((cdata) => lottosGrid.setGridOption('rowData', cdata))
        .then(() => lottosGrid.applyColumnState(
            {state: [{colId:'pct_chg', sort:'desc'}], defaultState: {sort: null}})
        );
};

function getVolumeMovers(){
  reset_grid();
    fetch('../data/contracts/vol.json')
        .then(response => response.json())
        .then((cdata) => lottosGrid.setGridOption('rowData', cdata))
        .then(() => lottosGrid.applyColumnState(
            {state: [{colId:'volume', sort:'desc'}], defaultState: {sort: null}})
        );
};

function getOIMovers(){
  reset_grid();
    fetch('../data/contracts/oi.json')
        .then(response => response.json())
        .then((cdata) => lottosGrid.setGridOption('rowData', cdata))
        .then(() => lottosGrid.applyColumnState(
            {state: [{colId:'oi_chg', sort:'desc'}], defaultState: {sort: null}})
        );
};

function getVOIMovers(){
    reset_grid();
    fetch('../data/contracts/voi.json')
        .then(response => response.json())
        .then((cdata) => lottosGrid.setGridOption('rowData', cdata))
        .then(() => lottosGrid.applyColumnState(
            {state: [{colId:'volume', sort:'desc'}], defaultState: {sort: null}})
        );
}


getPercentMovers();