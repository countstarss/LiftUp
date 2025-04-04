'use client'
import { Button } from '@/components/ui/button'
import React from 'react'


const LoginWithGithubButton = () => {
  return (
    <Button 
      variant="outline" 
      type="button" 
      onClick={()=> {
          // signInWithGithub()
      }} 
      className="w-full"
    >
      Login with Github
    </Button>
  )
}

export default LoginWithGithubButton