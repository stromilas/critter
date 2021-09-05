export const themeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#b1712c',
      light: '#e7a059',
      dark: '#7d4500',
      contrastText: '#f3f3f3',
    },
    secondary: {
      main: '#fad883',
      light: '#ffffb4',
      dark: '#c5a754',
      contrastText: '#000000',
    },
    text: {
      primary: '#333333',
      secondary: '#4F4F4F',
      disabled: '#BDBDBD',
      hint: '#BDBDBD',
    },
    background: {
      default: '#F2F2F2',
      paper: '#FFFFFF',
    }
  },
  typography: {
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    button: {
      textTransform: 'none'
    }
  },
  shadows: [
    "none",
    "0px 2px 4px 0px rgba(0, 0, 0, 0.05)", 
    "0px 4px 6px rgba(0, 0, 0, 0.07)",
    "20px 55px 60px rgba(0, 0, 0, 0.25)",
    "10px 15px 60px rgba(0, 0, 0, 0.25)",
    ...Array(20).fill('none')
  ],
  components: {
    // App Bar
    MuiAppBar: {
      defaultProps: {
        color: 'default',
      }
    },
    // Avatar
    MuiAvatar: {
      variants: [
        {
          props: { variant: 'rounded-s', },
          style: {
            height: '30px',
            width: '30px',
            borderRadius: '4px',
          }
        },
        {
          props: { variant: 'rounded-m', },
          style: {
            height: '42px',
            width: '42px',
            borderRadius: '4px',
          }
        },
        {
          props: { variant: 'rounded-l', },
          style: {
            height: '60px',
            width: '60px',
            borderRadius: '4px',
          }
        },
      ]
    },
    // Button
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      }
    },
    // Link
    MuiLink: {
      
    },
    // Card
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '18px 18px',
        }
      },
    }
  },
}

export default themeOptions




// primary: {
//   main: '#2F80ED',
//   light: '#73afff',
//   dark: '#0055ba',
//   contrastText: '#f3f3f3',
// },
// secondary: {
//   main: '#ff6d8c',
//   dark: '#c83a5f',
//   light: '#ffa0bc',
//   contrastText: '#000000',
// },
// text: {
//   primary: '#333333',
//   secondary: '#4F4F4F',
//   disabled: '#BDBDBD',
//   hint: '#BDBDBD',
// },
// background: {
//   default: '#F2F2F2',
//   paper: '#FFFFFF',
// }