import React from 'react'
import { Box } from '@material-ui/system'
import logo from '../images/critter.svg'

const Logo = () => (
  <Box
    sx={{
      width: {
        xs: 35,
        sm: 45,
      },
      mr: 2,
    }}
    component="img"
    src={logo}
  />
)

export default Logo
