import React, { useState, useEffect } from "react";
import { CircleChevronUp,Package , SquareArrowRight,MailQuestionMark,LayoutGrid,ClipboardList,PackagePlus ,Plus     } from 'lucide-react';
import userI from '../images/user.png'
import { Link, Outlet } from 'react-router-dom';
import {BeatLoader } from 'react-spinner'
const DashBord = () => {
    const [Message, setMessage] = useState([]);
    const [selecteMenu, setSelecteMenu] = useState(() => localStorage.getItem('selecteMenu') || 'Dashbord');
    const user = JSON.parse(localStorage.getItem('user'));
  const handleMenuSelect = (menu) => {
    setSelecteMenu(menu);
    localStorage.setItem('selecteMenu', menu);
  };
  
    const getMessage = async () => {  
    try {
      const res = await axios.get("http://localhost:2025/api/Owner/getMessage",{
        headers: {
          'Authorization': `Bearer ${user.token}`
          }
      });
      setMessage(res.data);
      // }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  // const displayForm =()=>{
  //   if (Message.length == 0) {
  //     return(
        
  //     )
  //   } else {
      
  //   }
  // }

  useEffect(() => {
    getMessage();
  }, []);
  return (
    <div className='DashBord'>
      <div className='DashBord-Title'>
        <h2>Dashbord</h2>
      </div>
      <div className="DashBord-Menu">
        <div className='DashBord-Menu-1'>
          <div className='dashbord-menu-header'>
            <h3>Orders</h3>
            <span className='icon-circle'>
              <ClipboardList   size={28} color="#4f8cff" />
            </span>
          </div>
          <h1>14</h1>
          <div className='dashbord-menu-link'>
            <span className='icon-arrow'>
              <SquareArrowRight size={20} color="#4f8cff" />
            </span>
            <h5>Go to component</h5>
          </div>
        </div>

          <div className='DashBord-Menu-1'>
            <div className='dashbord-menu-header'>
              <h3>Categories</h3>
              <span className='icon-circle'>
                <LayoutGrid  size={28} color="#4f8cff" />
              </span>
            </div>
            <h1>9</h1>
            <Link onClick={()=>handleMenuSelect('Categories')} 
            style={{textDecoration:"none",width:"100%",backgroundColor:"wheat"}} 
            to='/ManagementDashboard/CategroiesBord'>  
              <div className='dashbord-menu-link'>
            <span className='icon-arrow'>
              <SquareArrowRight size={20} color="#4f8cff" />
            </span>
            <h5>Go to component</h5>
              </div>
            </Link>
          </div>
        <div className='DashBord-Menu-1'>
          <div className='dashbord-menu-header'>
            <h3>Products</h3>
            <span className='icon-circle'>
              <Package size={28} color="#4f8cff" />
            </span>
          </div>
          <h1>29</h1>
          <Link onClick={()=>handleMenuSelect('AllProducts')} 
            style={{textDecoration:"none",width:"100%",backgroundColor:"wheat"}} 
            to='/ManagementDashboard/AllProducts'>  
          <div className='dashbord-menu-link'>
              <span className='icon-arrow'>
                <SquareArrowRight size={20} color="#4f8cff" />
              </span>
              <h5>Go to component</h5>
          </div>
            </Link>
        </div>
        <div className='DashBord-Menu-1'>
          <div className='dashbord-menu-header'>
            <h3>Add New Products</h3>
            <span className='icon-circle'>
              <PackagePlus  size={28} color="#4f8cff" />
            </span>
          </div>
          <h1><Plus size={35}/></h1>
          <Link onClick={()=>handleMenuSelect('AddNewProduct')} 
            style={{textDecoration:"none",width:"100%",backgroundColor:"wheat"}} 
            to='/ManagementDashboard/AddNewProduct'>  
            <div className='dashbord-menu-link'>
              <span className='icon-arrow'>
                <SquareArrowRight size={20} color="#4f8cff" />
              </span>
              <h5>Go to component</h5>
            </div>
          </Link>

        </div>
      </div>
      <div className='DashBord-Menu-2'>
        <Link style={{textDecoration:"none"}} onClick={()=>handleMenuSelect('Users')} to='/ManagementDashboard/user'>  
          <div className="DashBord-Menu-2-1">
            <div className='dashbord-menu-link'>
              <span className='icon-arrow'>
                <SquareArrowRight style={{marginLeft:"24%"}} size={20} color="#4f8cff" />
              </span>
              <h5 style={{color:"white"}}>Go to User component</h5>
            </div>
            <img src={userI}alt="" />
          </div>
        </Link>
        <div className='DashBord-Menu-2-2'>
          <div className='dashbord-menu-link'>
              <span className='icon-arrow'>
                <SquareArrowRight  style={{marginLeft:"24%"}} size={20} color="#4f8cff" />
              </span>
              <h5 style={{color:"white"}}>Check Sels Message</h5>
          </div>
          <div className='Message'>

          </div>
          </div>
      </div>
    </div>
  )
}

export default DashBord