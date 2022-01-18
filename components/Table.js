import { Paper, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React,{useState} from 'react'
import { Controls } from './controls/Controls'
import PageHeader from './PageHeader'
import { TableContainer, TblHead, TblPagination } from './useTable'


const useStyles=makeStyles(theme=>({
    pageContent:{
margin:theme.spacing(5),
padding:theme.spacing(3)
    },
    searchInput:{
        width:'75%'
    },
    newButton: {
        position: 'absolute',
        right:'0px'
    }
}))
const Table = ({title,icon,headCells,data}) => {
    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()
    const [search,setSearch]=useState()
    const [filterFn,setFilterFn]=useState({ fn: items => { return items; } })
    const pages=[5,10,25]
    const [page,setPage]=useState(0)
    const [rowsPerPage,setRowsPerPage]=useState(pages[page])
    const classes=useStyles()
    const handleChangePage=(e,newPage)=>{
        setPage(newPage)
    }
    const handleRowsPerPage=(e)=>{
setRowsPerPage(parseInt(e.target.value,10))
setPage(0)
    }
    
    const handleSearch=(e)=>{
let target=e.target
setSearch(e.target.value)
console.log('name',e.target.vale)
setFilterFn({
    fn:  items => {
        let result
        headCells.map(ele=>{
            if (target.value === "")
            result= items;
        else if(target.name===ele.name)
            result=  items.filter(x => x[ele.id].toLowerCase().includes(target.value))
        })
           return result     
            
        }
        })
       

    }
    const filterSearch=()=>{

    }
    
      function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
    const recordsAfterPaging=()=>{
        return stableSort(filterFn.fn(data),getComparator(order,orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    }
    return (
        <div>
           
           <PageHeader title={title}  icons={icon} /> 
            <Paper className={classes.pageContent}>
              <TableContainer>
              <TblHead headCells={headCells} order={order} setOrder={setOrder} orderBy={orderBy} setOrderBy={setOrderBy} />
              <TableBody>
                  {
                      recordsAfterPaging().map(ele=>{
                          return <TableRow>
                              {
                                  headCells.map(col=>{
                                      return <TableCell>{ele[col.id]}</TableCell>
                                  })
                              }
                          </TableRow>
                        })
                  }
              </TableBody>
              <TableHead>
                  <TableRow>
                  {
                      headCells.map(ele=>{
                          return <TableCell>
                              {
                                  ele.disableSearch ? (
                                      null
                                  ):(
                <Controls.Input
                className={classes.searchInput}
                label={ele.placeholder}
                name={ele.name}
                onChange={handleSearch}/>
                                  )
                              }
                               
                          </TableCell>
                      })
                  }
                  </TableRow>
                 
              </TableHead>
              </TableContainer>
              <TblPagination page={page}pages={pages} rowsPerPage={rowsPerPage} employee={data} handleChangePage={handleChangePage} handleRowsPerPage={handleRowsPerPage} />
           </Paper> 
        </div>
    )
}

export default Table
