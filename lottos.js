
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
      field: 'pct_chg',
      headerName: '% Change',
      sortable: true,
      valueFormatter: function(params) {
        return params.value > 0 ? "↑ " + params.value.toFixed(2) + "%" : "↓ " + params.value.toFixed(2) + "%";
      },
      cellStyle: function(params) {
        return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
      },
      maxWidth: 160,
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
      hide: true,
      maxWidth: 160,
    },
    {
      field: 'voi',
      headerName: 'Vol/OI',
      valueFormatter: x => x.toFixed(2), // Arrow function for concise formatting
      hide: true,
      maxWidth: 160,
    },
    {
      field: 'openinterest',
      headerName: 'OI',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      maxWidth: 160,
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
];
 
  
const cgrid = {
    rowData:[], 
    columnDefs: columnDefsLottos,
};

lottosGrid = agGrid.createGrid(document.querySelector('#contracts_grid'), cgrid);

// Fetch data from the API
function getPercentMovers(){
    fetch('data/pct.json')
        .then(response => response.json())
        .then((cdata) => lottosGrid.setGridOption('rowData', cdata))
        .then(() => lottosGrid.applyColumnState(
            {state: [{colId:'pct_chg', sort:'desc'}], defaultState: {sort: null}})
        );
};

function getVolumeMovers(){
    fetch('data/vol.json')
        .then(response => response.json())
        .then((cdata) => lottosGrid.setGridOption('rowData', cdata))
        .then(() => lottosGrid.applyColumnState(
            {state: [{colId:'volume', sort:'desc'}], defaultState: {sort: null}})
        );
};

function getOIMovers(){
    fetch('data/oi.json')
        .then(response => response.json())
        .then((cdata) => lottosGrid.setGridOption('rowData', cdata))
        .then(() => lottosGrid.applyColumnState(
            {state: [{colId:'oi_chg', sort:'desc'}], defaultState: {sort: null}})
        );
};

function getVOIMovers(){
    fetch('data/voi.json')
        .then(response => response.json())
        .then((cdata) => lottosGrid.setGridOption('rowData', cdata))
        .then(() => lottosGrid.applyColumnState(
            {state: [{colId:'voi', sort:'desc'}], defaultState: {sort: null}})
        );
}