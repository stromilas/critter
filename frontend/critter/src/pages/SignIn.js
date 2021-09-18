import React from 'react'
import { useDispatch } from 'react-redux'
import authActions from '../store/auth'
import {
  Container,
  Button,
  Box,
  Avatar,
  Typography,
  TextField,
  Grid,
} from '@material-ui/core'
import { LockOutlined } from '@material-ui/icons'
import { Link as RouteLink, useHistory } from 'react-router-dom'
import api from '../core/endpoints'

const SignIn = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    try {
      const body = new FormData()
      body.append('username', event.target.username.value)
      body.append('password', event.target.password.value)
      api.post('auth/login', body, { 'Content-Type': 'multipart/form-data'})
        .then(res => {
          dispatch(authActions.login({
            token: res.data.token,
            user: res.data.user
          }))
          history.push('/')
        })
        .catch(e => {
          console.warn(e)
        })
    } catch (e) {
      console.log(e.response);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 2, backgroundColor: 'primary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            id="password"
            label="password"
            name="password"
            autoComplete="password"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
          >
            Sign in
          </Button>
          <Grid container>
            <Grid item xs>
              <RouteLink to="/forgot-password">Forgot password?</RouteLink>
            </Grid>
            <Grid item>
              <RouteLink to="/signup">
                {"Don't have an account? Sign Up"}
              </RouteLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default SignIn
