import React, { useEffect, useState } from 'react'
import { Card, Container, Stack } from '@material-ui/core'
import { useSelector } from 'react-redux'
import CreatePost from '../components/CreatePost'
import api from '../core/api'
import Post from '../components/Post'

const UserPage = () => {
  const [posts, setPosts] = useState([])

  return (
    <Container sx={{ mt: 5 }}>
      <Stack direction="row" spacing={5}>
        {/* Feed */}
        USER :)
      </Stack>
    </Container>
  )
}

export default UserPage