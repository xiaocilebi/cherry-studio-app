import React from 'react'
import { Button, ButtonProps } from 'tamagui'

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode
}

export const CustomButton: React.FC<CustomButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      backgroundColor="$backgroundSecondary"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$4"
      pressStyle={{
        backgroundColor: '$colorBrand',
        borderColor: '$colorBrand',
        scale: 0.98,
      }}
      hoverStyle={{
        backgroundColor: '$backgroundSecondary',
        borderColor: '$colorBrand',
      }}
      {...props}
    >
      {children}
    </Button>
  )
}