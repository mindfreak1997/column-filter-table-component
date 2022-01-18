import React,{useState} from 'react'
import EmployeeForm from './EmployeeForm'
import PageHeader from '../../PageHeader';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Paper, TableBody, TableCell, TableRow ,Table, TableHead, TablePagination, Toolbar, InputAdornment, Tooltip} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { TableContainer, TblHead, Tblhead, TblPagination } from '../../useTable';
import { deleteEmployee, getAllEmployee, updateEmployee } from '../../../services/employeeServices';
import { Controls } from '../../controls/Controls';
import Search from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Popup from '../../controls/Popup';
import { insertEmployees } from '../../../services/employeeServices'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Notification from '../../Notification';
import ConfirmDialog from '../../ConfirmDialog';
import ToolTip from '../../ToolTip';

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
const Employees = () => {
    const [employee,setEmployee]=useState(getAllEmployee())
    const [filterFn,setFilterFn]=useState({ fn: items => { return items; } })
    const pages=[5,10,25]
    const [page,setPage]=useState(0)
    const [rowsPerPage,setRowsPerPage]=useState(pages[page])
    const [openPopup,setOpenPopup]=useState(false)
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [tipOpen,setTipOpen]=useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()
    const classes=useStyles()

    const headCells = [
        { id: 'fullName', label: 'Employee Name' },
        { id: 'email', label: 'Email Address (Personal)' },
        { id: 'mobile', label: 'Mobile Number' },
        { id: 'department', label: 'Department',disableSorting: true },
        { id: 'actions', label: 'Actions', disableSorting: true }
    ]
    const searchFilter=[
        {label:'search employee',name:'name'},
        {label:'search email',name:'email'},
        {label:'search mobile',name:'mobile'},
        {label:'department',name:'department',disableSearch:true},
        {label:'Actcion',name:'action',disableSearch:true}
    ]
    const handleChangePage=(e,newPage)=>{
        setPage(newPage)
    }
    const handleRowsPerPage=(e)=>{
setRowsPerPage(parseInt(e.target.value,10))
setPage(0)
    }
    
    const handleSearch=(e)=>{
let target=e.target
console.log('name',target.name)
setFilterFn({
    fn: items => {
        if (target.value === "")
            return items;
        else if(target.name==='email'){
            return items.filter(x => x.email.toLowerCase().includes(target.value))
        }else if(target.name==='mobile'){
            return items.filter(x => x.mobile.includes(target.value))
        }else
            return items.filter(x => x.fullName.toLowerCase().includes(target.value))
    }
})
    }
    const openInPopup = (item) => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }
    const handleClose = () => {
        setTipOpen(false);
      };
    
      const handleOpen = () => {
        setTipOpen(true);
      };
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
        return stableSort(filterFn.fn(employee),getComparator(order,orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    }
    const addOrEdit=(formData,handleReset)=>{
        if (formData.id == 0)
        insertEmployees(formData)
    else
        updateEmployee(formData)
        setRecordForEdit(null)
        handleReset()
        setOpenPopup(false)
        setEmployee(getAllEmployee())
    }
    const onDelete = id => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        deleteEmployee(id);
        setEmployee(getAllEmployee())
        setNotify({
            isOpen: true,
            message: 'Deleted Successfully',
            type: 'error'
        })
    }
    return (
        <div>
            <PageHeader title='New Employees'   icons={<PeopleAltIcon fontSize='large'/>}/>
            <Paper className={classes.pageContent}>
            {/*   <EmployeeForm />  */} 
           {/*  <Toolbar style={{display:'flex',flexDirection:'row'}}>
                <Controls.Input
                className={classes.searchInput}
                label='Search Employee'
                onChange={handleSearch}
                InputProps={{startadorement:(<InputAdornment position='start'>
                <Search/>
                </InputAdornment> ) 
                }}/>
                <Controls.Button
                className={classes.newButton}
                style={{marginLeft:'125px'}}
                text='Add New'
                variant='outlined'
                startIcon={<AddIcon/>}
                onClick={()=>{
                    setOpenPopup(true)
                }}/>
            </Toolbar> */}
          <TableContainer>
              <TblHead headCells={headCells} order={order} setOrder={setOrder} orderBy={orderBy} setOrderBy={setOrderBy} />
              <TableBody>
              {
                  recordsAfterPaging().map(ele=>{
                      return(
                          <TableRow key={ele.id}>
                              <TableCell>{ele.fullName}</TableCell>
                              <TableCell>{ele.email}</TableCell>
                              <TableCell>{ele.mobile}</TableCell>
                              <TableCell>{ele.departmentId}</TableCell>
                              <TableCell>
                                   <ToolTip open={tipOpen} onClose={handleClose} onOpen={handleOpen} title="Click to Edit" arrow>
                                       <Controls.ActionButton
                                            color="primary"
                                            onClick={() => { openInPopup(ele) }}>
                                             <Tooltip title="Click to Edit" placement="bottom">
                                            <EditOutlinedIcon fontSize="small" />
                                            </Tooltip>
                                        </Controls.ActionButton>
                                    </ToolTip>
                                        
                                        <Controls.ActionButton
                                            color="secondary"
                                            onClick={() => {
                                                setConfirmDialog({
                                                    isOpen: true,
                                                    title: 'Are you sure to delete this record?',
                                                    subTitle: "You can't undo this operation",
                                                    onConfirm: () => { onDelete(ele.id) }
                                                })
                                            }}>
                                                <Tooltip title="Click to Delete" placement="bottom">
                                            <CloseIcon fontSize="small" />
                                            </Tooltip>
                                        </Controls.ActionButton>
                                        
                              </TableCell>
                          </TableRow>
                      )
                  })
              }
              </TableBody>
              <TableHead>
                  <TableRow>
                  {
                      searchFilter.map(ele=>{
                          return <TableCell>
                              {
                                  ele.disableSearch ? (
                                      null
                                  ):(
<Controls.Input
                className={classes.searchInput}
                label={ele.label}
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
          <TblPagination page={page}pages={pages} rowsPerPage={rowsPerPage} employee={employee} handleChangePage={handleChangePage} handleRowsPerPage={handleRowsPerPage} />
            </Paper>
            <Popup
            openPopup={openPopup}
            title='Employee Form'
            setOpenPopup={setOpenPopup}>
            <EmployeeForm addOrEdit={addOrEdit} recordForEdit={recordForEdit}/>
            </Popup>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </div>
    )
}

export default Employees
