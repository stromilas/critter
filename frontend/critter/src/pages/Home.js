import { Card, Container, Stack } from '@material-ui/core'
import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import api from '../core/api'

const Home = () => {
  const [posts, setPosts] = useState([])
  const authenticated = useSelector(state => state.auth.authenticated)

  useEffect(() => {
    api.get('posts')
      .then(res => {
        console.log(res.data);
        setPosts(res.data?.posts ?? [])
      })
      .catch(e => console.error(e))
  }, [])

  return (
    <Container sx={{ mt: 5 }}>
      <Stack direction='row' spacing={5}>
        {/* Main Feed */}
        <Stack flexGrow='1' spacing={5}>
          {/* New Post */}
          { authenticated && (
            <Card>
              New Post
            </Card>
          )}
          {/* Feed */}
          { posts.map(post => (
            <Card key={post.id}>:)</Card>
          ))}
        </Stack>

        {/* Side Feed */}
        <Stack sx={{ 
          width: 300,
          display: {
            xs: 'none',
            sm: 'flex'
          }
        }}>
          {/* Trending Hashtags */}
          <Card>
            Trend
          </Card>  
        </Stack>
      </Stack>
    </Container>
  )
}

export default Home