import React, { useEffect, useState } from 'react'
import { Card, Container, Stack } from '@material-ui/core'
import { useSelector } from 'react-redux'
import CreatePost from '../components/CreatePost'
import api from '../core/endpoints'
import Post from '../components/Post'

const HomePage = () => {
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
    <Container sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent='center' spacing={2}>
        {/* Side */}
        <Card sx={{ width: { xs: 200, md: 250 }, height: '100%', pr: 0 }}>
          Trend
        </Card>

        {/* Feed */}
        <Stack maxWidth='sm' flexGrow="1" spacing={2}>
          {authenticated && <CreatePost onSubmit={submitPost} />}
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}

export default HomePage
