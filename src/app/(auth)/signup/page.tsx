import React from 'react'
import { SignUpForm } from './components/SignUpForm'

const page = () => {
  return (
    <div className='w-full h-full'>
      <div className='items-center flex justify-center translate-y-1/3'>
        <SignUpForm />
      </div>
    </div>
  )
}

export default page