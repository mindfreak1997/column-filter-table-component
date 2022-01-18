
import {  createTheme, CssBaseline,ThemeProvider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Table from './components/Table';
import Header from './components/header';
import SideMenu from './components/SideMenu';
import Employees from './components/Pages/Employees/Employees';
import { useState } from 'react';
import { getAllEmployee } from './services/employeeServices';
import  data from './mock.json'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
const theme=createTheme({
  palette:{
    primary: {
      main: "#333996",
      light: '#3c44b126'
    },
    secondary: {
      main: "#f83245",
      light: '#f8324526'
    },
    background:{
      default:'#B1D0E0'
    },
    shape:{
      borderRadius:'12px'
    },

  },
  overrides:{
    MuiAppBar:{
      root:{
        transform:'translateZ(0)'
      }
    }
  }
})
const useStyle=makeStyles({
  appMain:{
    paddingLeft:'200px',
    height:'100%'
  }
})
function App() {
  const [employee,setEmployee]=useState(getAllEmployee())
  const classes=useStyle()
  const headCells = [
    { id: 'fullName', label: 'Employee Name',column:'fullName',placeholder:'search employee',name:'name' },
    { id: 'email', label: 'Email Address (Personal)',column:'email',placeholder:'search email',name:'email' },
    { id: 'mobile', label: 'Mobile Number',column:'mobile',placeholder:'search mobile',name:'mobile' },
    { id: 'department', label: 'Department',column:'departmentId', disableSorting: true,disableSearch:true }
]
const customer=[
  {id:'fullName',label:'customer Name',placeholder:'search Customer',name:'customer'},
  {id:'email',label:'Customer Email',placeholder:'search Email',name:'email'},
  {id:'phoneNumber',label:'Customer phoneNumber',placeholder:'search phoneNumber',name:'phoneNumber'},
  {id:'address',label:'Customer Address',disableSearch:true,disableSorting:true}
]
console.log('data',data)
const icon=<PeopleAltIcon fontSize='large'/>
  return (
    
    <ThemeProvider theme={theme}>
      <SideMenu/>
      <div className={classes.appMain}>
        <Table data={employee} headCells={headCells} title='Employee Table' icon={icon}/>
        <Table data={data} headCells={customer} title='Customer Table'/>
      </div>
      <CssBaseline/>
    </ThemeProvider>
  
   
  );
}

export default App;
