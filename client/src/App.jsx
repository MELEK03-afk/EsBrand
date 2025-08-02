import { useState } from 'react'
import {BrowserRouter as Router,Routes,Route, Navigate} from 'react-router-dom'
import './App.css'
import HeaderBar from './components/HeaderBar'
import HomeComp from './components/HomeComp'
import SeConnect from './components/SeConnect'
import ContactPage from './components/ContactPage'
import ManagementDashboard from './components/ManagementDashboard'
import DashBord from './components/DashBord'
import UserBord from './components/UserBord'
import CategroiesBord from './components/CategroiesBord'
import AddProduct from './components/AddProduct'
import AllProducts from './components/AllProducts'
import ProductsU from './components/ProductsU'
import PorductSelecte from './components/PorductSelecte'

function App() {
  const [count, setCount] = useState(0)
  const [showBag, setShowBag] = useState(false); // LIFTED STATE

  return (
    <Router>
      <HeaderBar setShowBag={setShowBag} showBag={showBag} />
      <Routes>
        <Route path='/' element={<HomeComp/>}/>
        <Route path='/PorductSelecte/:id' element={<PorductSelecte setShowBag={setShowBag} />}/>
        <Route path='/Seconnect' element={<SeConnect/>}/>
        <Route path='/ProductU/:subcategoryName' element={<ProductsU/>}/>
        <Route path='/ContactPage' element={<ContactPage/>}/>
        <Route path='/ManagementDashboard/*' element={<ManagementDashboard/>}>
          <Route index element={<Navigate to="DashBord" replace />} />
          <Route path='DashBord' element={<DashBord/>}/>
          <Route path='CategroiesBord' element={<CategroiesBord/>}/>
          <Route path='user' element={<UserBord/>}/>
          <Route path='AddNewProduct' element={<AddProduct/>}/>
          <Route path='AllProducts' element={<AllProducts/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
