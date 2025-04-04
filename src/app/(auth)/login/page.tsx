import React from 'react'
import { LoginForm } from './components/LoginForm'

const page = () => {
  return (
    <div className='w-full h-full'>
      <div className='items-center flex justify-center translate-y-1/3'>
        <LoginForm />
      </div>
    </div>
  )
}

export default page