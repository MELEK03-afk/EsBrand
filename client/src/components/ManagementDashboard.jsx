import React, { useState, useEffect } from 'react';
import { AlignStartVertical,UsersRound,ShoppingCart,Folders,Package,PackagePlus ,MessageCircleWarning  } from 'lucide-react';
import { Link ,Outlet, useLocation } from 'react-router-dom';
import DashBord from './DashBord';
import UserBord from './UserBord';
import { ScaleLoader } from "react-spinners"; // Import ScaleLoader

const   ManagementDashboard = () => {
  const [selecteMenu, setSelecteMenu] = useState(() => localStorage.getItem('selecteMenu') || 'Dashbord');
  const location = useLocation();
  const [loading, setLoading] = useState(true); // State for loading

  const handleMenuSelect = (menu) => {
    setSelecteMenu(menu);
    localStorage.setItem('selecteMenu', menu);
  };

  useEffect(() => {
    // Map pathnames to menu names
    if (location.pathname.includes('/user')) {
      setSelecteMenu('Users');
    } else if (location.pathname.includes('/DashBord')) {
      setSelecteMenu('Dashbord');
    } else if (location.pathname.includes('/Orders')) {
      setSelecteMenu('Orders');
    } else if (location.pathname.includes('/CategroiesBord')) {
      setSelecteMenu('Categories');
    } else if (location.pathname.includes('/AllProducts')) {
      setSelecteMenu('AllProducts');
    } else if (location.pathname.includes('/AddNewProduct')) {
      setSelecteMenu('AddNewProduct');
    } else if (location.pathname.includes('/SalesReports')) {
      setSelecteMenu('SalesReports');
    }
    console.log(selecteMenu);
    
  }, [location.pathname]);

  useEffect(() => {
    setTimeout(() => {
        setLoading(false);
      }, 4000);
  },[])


  return (
    <div className='ManagementDashboard'>
       
        <div className='ManagementDashboard-1'>
          <div className='h2Dash'>
            <Link style={{textDecoration:"none",cursor:"pointer"}} to='/'>
              <h2>Es</h2>
            </Link>
          </div>
          <div className='MenuDashbord'>
            <h4>Menu</h4>
            <div className='h2Dash' >
              <div className='clickLink' style={{display: selecteMenu === 'Dashbord'?'':"none"}}></div>
              <AlignStartVertical style={{marginLeft:"10%",color: selecteMenu === 'Dashbord'?'white':"gray"}}/>
              <Link onClick={()=>handleMenuSelect('Dashbord')} style={{textDecoration:"none"}} to='/ManagementDashboard/DashBord'>  
                <h3  style={{marginLeft:"5%",fontSize: selecteMenu ==="Dashbord"?"":"13px",cursor:"pointer",color: selecteMenu === 'Dashbord'?'white':"gray"}}>Dashboard</h3>
              </Link>
            </div>
            <div className='h2Dash' >
              <div className='clickLink' style={{display: selecteMenu === 'Users'?'':"none"}}></div>
              <UsersRound   style={{marginLeft:"12%",color: selecteMenu === 'Users'?'white':"gray"}}/>
              <Link onClick={()=>handleMenuSelect('Users')} style={{textDecoration:"none"}} to='/ManagementDashboard/user'>  
                <h3  style={{marginLeft:"5%",fontSize: selecteMenu ==="Users"?"":"13px",cursor:"pointer",color: selecteMenu === 'Users'?'white':"gray"}}>Users</h3>
              </Link>
            </div>
            <div className='h2Dash'>
              <div className='clickLink' style={{display: selecteMenu === "Orders" ?'':"none"}}></div>
              <ShoppingCart   style={{marginLeft:"10%",color: selecteMenu === 'Orders'?'white':"gray"}}/>
              <h3 onClick={()=>handleMenuSelect('Orders')} style={{marginLeft:"5%",fontSize: selecteMenu ==="Orders"?"":"13px",cursor:"pointer",color: selecteMenu === 'Orders'?'white':"gray"}}>Orders</h3>
            </div>
            <div className='h2Dash'>
              <div className='clickLink' style={{display: selecteMenu === "Categories" ?'':"none"}}></div>
              <Folders style={{marginLeft:"10%",color: selecteMenu === 'Categories'?'white':"gray"}}/>
              <Link onClick={()=>handleMenuSelect('Categories')} style={{textDecoration:"none"}} to='/ManagementDashboard/CategroiesBord'>  
                <h3    style={{marginLeft:"5%",fontSize: selecteMenu ==="Categories"?"":"13px",cursor:"pointer",color: selecteMenu === 'Categories'?'white':"gray"}}>Categories</h3>
              </Link>
            </div>
            <div className='h2Dash'>
              <div className='clickLink' style={{display: selecteMenu === "AllProducts" ?'':"none"}}></div>
              <Package style={{marginLeft:"10%",color: selecteMenu === 'AllProducts'?'white':"gray"}}/>
              <Link onClick={()=>handleMenuSelect('AllProducts')} style={{textDecoration:"none"}} to='/ManagementDashboard/AllProducts'>  
                <h3  onClick={()=>handleMenuSelect('AllProducts')} style={{marginLeft:"5%",fontSize: selecteMenu ==="AllProducts"?"":"13px",cursor:"pointer",color: selecteMenu === 'AllProducts'?'white':"gray"}}>AllProducts</h3>
              </Link>          
            </div>
            <div className='h2Dash' >
              <div className='clickLink' style={{display: selecteMenu === "AddNewProduct" ?'':"none"}}></div>
              <PackagePlus  style={{marginLeft:"10%",color: selecteMenu === 'AddNewProduct'?'white':"gray"}}/>
              <Link onClick={()=>handleMenuSelect('AddNewProduct')} style={{textDecoration:"none"}} to='/ManagementDashboard/AddNewProduct'>  
                <h3 onClick={()=>handleMenuSelect('AddNewProduct')} style={{marginLeft:"0.01%",fontSize: selecteMenu ==="AddNewProduct"?"15px":"13px",cursor:"pointer",color: selecteMenu === 'AddNewProduct'?'white':"gray"}}>Add New Product</h3>
              </Link>
            </div>
            <div className='h2Dash'>
              <div className='clickLink' style={{display: selecteMenu === "SalesReports" ?'':"none"}}></div>
              <MessageCircleWarning  style={{marginLeft:"10%",color: selecteMenu === 'SalesReports'?'white':"gray"}}/>
              <h3  onClick={()=>handleMenuSelect('SalesReports')} style={{marginLeft:"5%",fontSize: selecteMenu ==="SalesReports"?"":"13px",cursor:"pointer",color: selecteMenu === 'SalesReports'?'white':"gray"}}>Sales Reports</h3>
            </div>
          </div>
        </div>
        {loading ? (
          <ScaleLoader style={{position:"absolute",top:"40%",marginLeft:"55%",fontSize:"xx-large"}} color="white" />
      ) :( 
      <>    
        <div className='ManagementDashboard-2'>
          <Outlet />
        </div>
      </>
    )}
    </div>
  )
}

export default ManagementDashboard