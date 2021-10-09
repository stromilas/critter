import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  CircularProgress,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import { Switch, Link, Route } from 'react-router-dom'
import CreatePost from '../components/CreatePost'
import Post from '../components/Post'
import { Redirect, useHistory, useLocation, useParams, useRouteMatch } from 'react-router'
import { Box } from '@material-ui/system'
import Posts from '../components/Posts'
import api, { media } from '../core/endpoints'

const SettingsPage = () => {
  const { username } = useParams()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const { url } = useRouteMatch()
  const { pathname } = useLocation()
  const history = useHistory()

  useEffect(() => {
    api
      .get(`users/${username}`)
      .then((res) => {
        setUser(res.data.user)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoading(false)
      })
  }, [username])

  return (
    <>
      {loading ? (
        <Stack mt={5} alignItems="center">
          <CircularProgress color="primary" />
        </Stack>
      ) : (
        <>
          <Container sx={{ position: 'relative' }}>
            <Stack direction="row" justifyContent='center' gap={2} sx={{ mt: 2 }}>
              {/* Side Menu */}
              <Card sx={{ width: { xs: 200, md: 300 }, height: '100%', pr: 0 }} >
                <Tabs
                  value={pathname}
                  orientation="vertical"
                  scrollButtons={false}
                >
                  <Tab
                    label="Profile"
                    value={`${url}/profile`}
                    to={`${url}/profile`}
                    component={Link}
                    sx={{ color: 'inherit', mr: 2 }}
                  />
                </Tabs>
              </Card>
              {/* Contents */}
              <Stack direction="column" gap={2} width='100%' maxWidth='sm'>
                <Switch>
                  <Route path={url} exact>
                    <Redirect to={`${url}/profile`} />
                  </Route>
                  <Route path={`${url}/profile`}>
                    <Card>
                      
                    </Card>
                  </Route>
                </Switch>
              </Stack>
            </Stack>
          </Container>
        </>
      )}
    </>
  )
}

export default SettingsPage
