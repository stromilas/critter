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
import {
  Redirect,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router'
import TopPosts from '../components/TopPosts'
import LatestPosts from '../components/LatestPosts'
import PopularUsers from '../components/PopularUsers'

const ExplorePage = () => {
  const { url } = useRouteMatch()
  const { pathname } = useLocation()

  return (
    <Container>
      <Stack direction="row" justifyContent='center' gap={2} sx={{ mt: 2 }}>
        <Card sx={{ width: { xs: 200, md: 250 }, height: '100%', pr: 0 }}>
          <Tabs value={pathname} orientation="vertical" scrollButtons={false}>
            <Tab
              label="Top"
              value={`${url}/top`}
              to={`${url}/top`}
              component={Link}
              sx={{ color: 'inherit', mr: 2 }}
            />
            <Tab
              label="Latest"
              value={`${url}/latest`}
              to={`${url}/latest`}
              component={Link}
              sx={{ color: 'inherit', mr: 2 }}
            />
            <Tab
              label="People"
              value={`${url}/people`}
              to={`${url}/people`}
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
          </Tabs>
        </Card>
        <Stack gap={2} width='100%' maxWidth='sm'>
          <Switch>
            <Route path={url} exact>
              <Redirect to={`${url}/top`} />
            </Route>
            <Route path={`${url}/top`}>
              <TopPosts />
            </Route>
            <Route path={`${url}/latest`}>
              <LatestPosts />
            </Route>
            <Route path={`${url}/people`}>
              <PopularUsers />
            </Route>
            <Route path={`${url}/media`}>
              <TopPosts hasMedia />
            </Route>
          </Switch>
        </Stack>
      </Stack>
    </Container>
  )
}

export default ExplorePage
