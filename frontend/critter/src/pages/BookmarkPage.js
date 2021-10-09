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

const BookmarkPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  useEffect(() => {
    api
      .get(`posts/saved`)
      .then((res) => {
        setPosts(res.data.posts)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [])

  return (
    <Container maxWidth='sm'>
      <Stack direction='column' gap={2} mt={2} >
        {posts?.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </Stack>
    </Container>
  )
}

export default BookmarkPage