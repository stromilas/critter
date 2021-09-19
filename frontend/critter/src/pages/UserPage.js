import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@material-ui/core'
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
                <Button variant="contained" color="primary">
                  Follow
                </Button>
              </Stack>
            </Card>

            {/* Contents */}
          </Container>
        </>
      )}
    </>
  )
}

export default UserPage
