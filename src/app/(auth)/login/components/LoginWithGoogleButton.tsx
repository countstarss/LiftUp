'use client'
import { Button } from '@/components/ui/button'
import React from 'react'


const LoginWithGoogleButton = () => {
  return (
    <Button 
      variant="outline" 
      type="button" 
      onClick={()=> {
          // signInWithGoogle()
      }} 
      className="w-full"
    >
      Login with Google
    </Button>
  )
}

export default LoginWithGoogleButton