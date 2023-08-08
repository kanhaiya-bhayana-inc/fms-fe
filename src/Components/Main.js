import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'

export default function Main() {
  
  return (
    <div className='text-center ' style={{backgroundColor:'#FFFFFF'}}>
    <Navbar />
    <Outlet />
    <Footer />
    
    </div>
  )
}
