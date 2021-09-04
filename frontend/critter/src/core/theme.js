export const themeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#494c3e',
      light: '#757869',
      dark: '#212418',
    },
    secondary: {
      main: '#f2ead7',
      dark: '#bfb8a6',
      light: '#ffffff',
    },
    text: {
      primary: 'rgba(20,19,19,0.87)',
      secondary: 'rgba(26,25,25,0.54)',
      disabled: 'rgba(24,23,23,0.38)',
    },
  },
  typography: {
    fontFamily: 'Source Sans Pro',
    fontWeightMedium: 400,
    fontWeightRegular: 400,
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: 'default',
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      }
    },
    MuiLink: {
      
    }
  },
}

export default themeOptions
