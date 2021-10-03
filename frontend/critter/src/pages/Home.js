import React, { useEffect, useState } from 'react'
import { Card, Container, Stack } from '@material-ui/core'
import { useSelector } from 'react-redux'
import CreatePost from '../components/CreatePost'
import api from '../core/endpoints'
import Post from '../components/Post'

const Home = () => {
  const [posts, setPosts] = useState([])
  const authenticated = useSelector((state) => state.auth.authenticated)

  useEffect(() => {
    api
      .get('posts')
      .then((res) => {
        setPosts(res.data?.posts ?? [])
      })
      .catch((e) => console.error(e))
  }, [])

  const submitPost = (id, text, files) => {
    const body = {
      post: { id, text, files },
    }
    api.post('posts', body)
      .then((res) => {
        console.log(res)
      })
      .catch((e) => {
        console.warn(e)
      })
  }

  return (
    <Container sx={{ mt: 3 }}>
      <Stack direction="row" spacing={3}>
        {/* Feed */}
        <Stack flexGrow="1" spacing={3} sx={{ maxWidth: '800px' }}>
          {authenticated && <CreatePost onSubmit={submitPost} />}
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </Stack>

        {/* Side */}
        <Stack
          sx={{
            width: 300,
            display: {
              xs: 'none',
              sm: 'flex',
            },
          }}
        >
          <Card sx={{ p: 5 }}>Trend</Card>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Home
