import React, { useEffect, useState } from 'react'
import { Card, CircularProgress, Container, Stack } from '@material-ui/core'
import { useSelector } from 'react-redux'
import CreatePost from '../components/CreatePost'
import api, { media } from '../core/endpoints'
import Post from '../components/Post'
import { useParams } from 'react-router'
import { Box } from '@material-ui/system'

const UserPage = () => {
  const { id } = useParams()
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get(`users/${id}`)
      .then((res) => {
        setUser(res.data.user)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [id])

  return (
    <>
      {loading ? (
        <Stack mt={5} alignItems="center">
          <CircularProgress color="primary" />
        </Stack>
      ) : (
        <>
          <Box 
            src={media + user.banner} 
            component="img"
            sx={{
              height: {
                xs: 200,
                md: 300,
              },
              width: '100%',
              objectFit: 'cover'
              
            }}
          />
          <Container sx={{ mt: 5 }}>
            <Stack direction="row" spacing={5}>
              {/* Feed */}
              USER :)
            </Stack>
          </Container>
        </>
      )}
    </>
  )
}

export default UserPage
