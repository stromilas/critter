import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { Avatar, Card, Container, Stack, Typography } from '@material-ui/core'
import Post from '../components/Post'
import api from '../core/api'
import { Box } from '@material-ui/system'

const PostPage = () => {
  const { id } = useParams()
  const [post, setPost] = useState(useLocation().state?.post)
  const [replies, setReplies] = useState([])

  useEffect(() => {
    if (!post) {
      api
        .get(`posts/${id}`)
        .then((res) => {
          setPost(res.post)
        })
        .catch((e) => {
          console.error(e)
          // TODO: Show notification
        })
    }
  }, [post])

  useEffect(() => {
    api
      .get(`posts`, { params: { parent_id: id } })
      .then((res) => {
        console.log(res);
        setReplies(res.data.posts)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [id])

  const date = new Date(post.created_at).toDateString()

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Card>
        <Stack direction="row">
          <Avatar variant="rounded-m" sx={{ mr: 2 }}>
            {post.user.name[0]}
          </Avatar>
          <Stack justifyContent="center">
            <Stack direction="row" gap="3px" alignItems="center">
              <Typography color="text.primary" fontWeight="600">
                {post.user.name}
              </Typography>
              <Typography variant="caption" color="text.hint">
                {'@'}
                {post.user.username}
              </Typography>
            </Stack>
            <Typography color="text.hint" variant="caption">
              {date}
            </Typography>
          </Stack>
        </Stack>

        {/* Text */}
        <Box sx={{ my: 3 }}>
          <Typography>{post.text}</Typography>
        </Box>
      </Card>

      {replies?.map(post => (
        <Post 
          {...post}
          sx={{my: 3}}
        />
      ))}
    </Container>
  )
}

export default PostPage
