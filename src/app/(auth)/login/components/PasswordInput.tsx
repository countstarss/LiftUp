'use client'
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="relative">
      <Input type={showPassword ? "text" : "password"} placeholder="Password" id="password" name="password" required/>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 transform -translate-y-1/2"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </Button>
    </div>
  );
}