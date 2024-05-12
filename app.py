import dash
import json 
import pandas as pd 
import numpy as np 
import datetime as dt 
import dash_daq as daq
import dash_ag_grid as dag
import dash_bootstrap_components as dbc
from dash import Dash, html, callback, Output, Input, ctx, dcc, Patch, State

column_def_oi = [
    {
        'field': 'stock', 
        'sortable': True, 
        'headerName': 'Stock',
        'valueFormatter': {'function':'"$"+params.value.toUpperCase()'}

    },
    {
        'field': 'total_oi', 
        'sortable': True,
        'headerName': 'Total Open Interest',
        'valueFormatter': {'function': 'params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")'},
        "filter": "agNumberColumnFilter",
        "filterValueGetter": {"function": "(params.value"},
        "filterParams": {"filterOptions": ['lessThan', 'greaterThan', 'inRange']},
        "editable": True
    }, 
    {
        'field': 'call_oi_pct',
        'sortable': True,
        'headerName': 'Call %', 
        'valueFormatter': {'function':'params.value.toFixed(2) + "%"'},
    },
    {
        'field': 'call_oi_pct_chng',
        'sortable': True,
        'headerName': '🟢Change',
        'hide': False, 
        'valueFormatter': {'function':'params.value > 0 ? "↑ " + params.value.toFixed(2) + "%" : "↓ " + params.value.toFixed(2) + "%"'}, 
        'cellStyle': {"function": "params.value > 0 ? {'color': 'green'} : {'color': 'red'}"}

    }, 
    {
        'field': 'put_oi_pct', 
        'sortable': True, 
        'headerName': 'Put%',
        'valueFormatter': {'function':'params.value.toFixed(2) + "%"'},
    },
    {
        'field': 'put_oi_pct_chng',
        'sortable': True,
        'headerName': '🔴Change',
        'hide': False,
        'valueFormatter': {'function':'params.value > 0 ? "↑ " + params.value.toFixed(2) + "%" : "↓ " + params.value.toFixed(2) + "%"'}, 
        'cellStyle': {"function": "params.value > 0 ? {'color': 'green'} : {'color': 'red'}"}

    }, 
]
column_def_vol = [
    {
        'field': 'stock', 
        'sortable': True, 
        'headerName': 'Stock',
        'valueFormatter': {'function': ' "$" + params.value.toUpperCase()'}
    },
    {
        'field': 'total_vol', 
        'sortable': True,
        'headerName': 'Total Volume',
        'valueFormatter': {'function': 'params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")'}
    }, 
    {
        'field':'avg_vol',
        'sortable': True,
        'headerName': 'Avg Volume (30D)',
        'valueFormatter': {'function': 'params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")'}
    },
    {
        'field': 'call_vol_pct',
        'sortable': True,
        'headerName': 'Call %', 
        'valueFormatter': {'function':'params.value.toFixed(2) + "%"'},
        'cellRenderer': 'agAnimateShowChangeCellRenderer',
    },
    {
        'field': 'call_vol_pct_chng',
        'sortable': True,
        'headerName': '🟢CHNG',
        'hide': False,
        'valueFormatter': {'function':'params.value > 0 ? "↑ " + params.value.toFixed(2) + "%" : "↓ " + params.value.toFixed(2) + "%"'}, 
        'cellStyle': {"function": "params.value > 0 ? {'color': 'green'} : {'color': 'red'}"}
    }, 
    {
        'field': 'put_vol_pct', 
        'sortable': True, 
        'headerName': 'Put %',
        'valueFormatter': {'function':'params.value.toFixed(2) + "%"'},
        'cellRenderer': 'agAnimateShowChangeCellRenderer',
    },
    {
        'field': 'put_vol_pct_chng',
        'sortable': True,
        'headerName': '🔴CHNG',
        'hide': False,
        'valueFormatter': {'function':'params.value > 0 ? "↑ " + params.value.toFixed(2) + "%" : "↓ " + params.value.toFixed(2) + "%"'}, 
        'cellStyle': {"function": "params.value > 0 ? {'color': 'green'} : {'color': 'red'}"}
    }
]

df_oi = pd.read_csv('data/oi_cp.csv')
df_vol = pd.read_csv('data/vol_cp.csv')

dfs = [df_oi, df_vol]
cdfs = [column_def_oi, column_def_vol]
names = ['Open Interest', 'Volume']

grid_dfs = [
    dag.AgGrid(
        className = 'ag-theme-alpine-dark compact',
        id=f"dg-{x}",
        rowData=dfs[x].to_dict('records'),
        columnDefs=cdfs[x],
        columnSize="responsiveSizeToFit",
        dashGridOptions={'pagination':True},
        getRowId = "params.data.stock",
        # style={'height': '5000px', 'width': '100%'},
    ) for x in range(len(dfs))
]

tab_content =[dbc.Card(dbc.CardBody([x]),className="mt-3") for x in grid_dfs]
tabs = dbc.Tabs([dbc.Tab(tab_content[x], label=names[x]) for x in range(len(tab_content))])

contain_style = {
    'display': 'flex',
    'justifyContent': 'left',
    'alignItems': 'left',
    'flexDirection': 'column'
}

header = html.H1('📈⏳ Volume & OI Flows 💨📉', style={'textAlign': 'center', 'marginTop': 40})
db_container= dbc.Container([dbc.Row([dbc.Col(tabs, width=12)])],style=contain_style)

app = Dash(__name__, external_stylesheets=[dbc.themes.DARKLY])
server = app.server
app.layout = html.Div(
    [
        html.H1('📈⏳ Call Put Percentages 💨📉', style={'textAlign': 'center', 'marginTop': 40}),
        db_container
    ]
)

if __name__ == "__main__":
    app.run_server(debug=True)