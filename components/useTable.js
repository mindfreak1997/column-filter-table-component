import { Table, TableHead, TableRow, TableSortLabel, TableCell, TablePagination } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useState } from 'react'

const useStyles=makeStyles(theme => ({
    table: {
        marginTop: theme.spacing(3),
        '& thead th': {
            fontWeight: '600',
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
        },
        '& tbody td': {
            fontWeight: '300',
        },
        '& tbody tr:hover': {
            backgroundColor: '#fffbf2',
            cursor: 'pointer',
        },
    },
}))



export const TableContainer=(props)=>{
    const classes=useStyles()
    return (
<Table sx={{ minWidth: '650px' }} className={classes.table}>
{props.children}
</Table>
    )
    
}

export const TblHead=({headCells,setOrder,setOrderBy,order,orderBy})=>{
    
    
    const handleSortRequest = cellId => {
        const isAsc = orderBy === cellId && order === "asc";
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(cellId)
    }
    
    return (
        <TableHead>
            <TableRow>
                {
                    headCells.map(ele=>{
                        return <TableCell key={ele.id}
                        sortDirection={orderBy === ele.id ? order : false}>
                       {ele.disableSorting ? ele.label :
                                <TableSortLabel
                                    active={orderBy === ele.id}
                                    direction={orderBy === ele.id ? order : 'asc'}
                                    onClick={() => { handleSortRequest(ele.id) }}>
                                    {ele.label}
                                </TableSortLabel>
                            }
                        </TableCell>})
                }
            </TableRow>
        </TableHead>
    )
}

export const TblPagination=({pages,page,rowsPerPage,employee,handleChangePage,handleRowsPerPage})=>{

    
    
    return(
       <TablePagination
        rowsPerPageOptions={pages}
        page={page}
        component='div'
        rowsPerPage={rowsPerPage}
        count={employee.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleRowsPerPage}
        />
    )
    
}