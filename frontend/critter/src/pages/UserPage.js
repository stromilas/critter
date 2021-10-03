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

const UserPage = () => {
  const { username } = useParams()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const myId = useSelector((state) => state.auth?.user?.id)
  const authenticated = useSelector((state) => state.auth.authenticated)
  const { url } = useRouteMatch()
  const { pathname } = useLocation()
  const history = useHistory()

  useEffect(() => {
    api
      .get(`users/${username}`)
      .then((res) => {
        setUser(res.data.user)
        setFollowing(res.data.user.is_following)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [username])

  const setFollow = boolean => {
    api.post(`users/${username}/follow`, { follow: boolean })
    setFollowing(boolean)
  }

  return (
    <>
      {loading ? (
        <Stack mt={5} alignItems="center">
          <CircularProgress color="primary" />
        </Stack>
      ) : (
        <>
          {/* Banner */}
          <Box
            src={media + user.banner}
            component="img"
            sx={{
              height: {
                xs: 200,
                md: 300,
              },
              width: '100%',
              objectFit: 'cover',
            }}
          />
          <Container sx={{ position: 'relative' }}>
            {/* User Profile */}
            <Card sx={{ mt: -10, height: 140, overflow: 'visible' }}>
              <Stack direction="row" alignItems="flex-start" gap={2}>
                <Avatar
                  variant="rounded-xxl"
                  src={media + user.profile}
                  alt={user.name}
                  sx={{
                    mt: -8,
                    borderWidth: '3px',
                    borderColor: 'background.paper',
                    borderStyle: 'solid',
                  }}
                />
                <Stack direction="row" alignItems="center" gap={2}>
                  <Typography variant="h5" component="h1" fontWeight="bold">
                    {user.name}
                  </Typography>
                  <Stack direction="row" gap={0.5} alignItems="center">
                    <Typography fontWeight="700">
                      {user.followees_num}
                    </Typography>
                    <Typography fontSize="12px" color="text.secondary">
                      Following
                    </Typography>
                  </Stack>
                  <Stack direction="row" gap={0.5} alignItems="center">
                    <Typography fontWeight="700">
                      {user.followers_num}
                    </Typography>
                    <Typography fontSize="12px" color="text.secondary">
                      Followers
                    </Typography>
                  </Stack>
                </Stack>
                <Box sx={{ flexGrow: 1 }} />

                {authenticated ? (
                  myId != user.id &&
                  (following ? (
                    <Button variant="text" color="primary" onClick={() => setFollow(false)}>
                      Unfollow
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => setFollow(true)}>
                      Follow
                    </Button>
                  ))
                ) : (
                  <Button  variant="contained" color="primary" onClick={() => history.push('/login')}>
                    Follow
                  </Button>
                )}
              </Stack>
            </Card>
            {/* Contents */}
            <Stack direction="row" gap={2} sx={{ mt: 2 }}>
              <Card sx={{ width: { xs: 200, md: 300 }, height: '100%', pr: 0 }} >
                <Tabs
                  value={pathname}
                  orientation="vertical"
                  scrollButtons={false}
                >
                  <Tab
                    label="Tweets"
                    value={`${url}/tweets`}
                    to={`${url}/tweets`}
                    component={Link}
                    sx={{ color: 'inherit', mr: 2 }}
                  />
                  <Tab
                    label="Tweets & Replies"
                    value={`${url}/replies`}
                    to={`${url}/replies`}
                    component={Link}
                    sx={{ color: 'inherit', mr: 2 }}
                  />
                  <Tab
                    label="Media"
                    value={`${url}/media`}
                    to={`${url}/media`}
                    component={Link}
                    sx={{ color: 'inherit', mr: 2 }}
                  />
                  <Tab
                    label="Likes"
                    value={`${url}/likes`}
                    to={`${url}/likes`}
                    component={Link}
                    sx={{ color: 'inherit', mr: 2 }}
                  />
                </Tabs>
              </Card>
              <Stack direction="column" gap={2} sx={{ flexGrow: 1 }}>
                <Switch>
                  <Route path={url} exact>
                    <Redirect to={`${url}/tweets`} />
                  </Route>
                  <Route path={`${url}/tweets`}>
                    <Posts username={username} />
                  </Route>
                  <Route path={`${url}/likes`}>
                    <Posts username={username} likes />
                  </Route>
                  <Route path={`${url}/replies`}></Route>
                </Switch>
              </Stack>
            </Stack>
          </Container>
        </>
      )}
    </>
  )
}

export default UserPage
