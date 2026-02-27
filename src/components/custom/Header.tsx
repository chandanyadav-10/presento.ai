import React from 'react'
import logo from '../../assets/logo.png'
import { Button } from '../ui/button'
import { useUser } from '@clerk/clerk-react'

function Header() {
  const {user} = useUser();
  return (
    <div className='flex items-center justify-between px-10 shadow'>
     <img src={logo} alt="Logo" width={130} height={130} />
     <Button>Get Started</Button>
    </div>
  )
}

export default Header
