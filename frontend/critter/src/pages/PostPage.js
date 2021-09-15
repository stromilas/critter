import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { Avatar, Card, Container, Stack, Typography } from '@material-ui/core'
import Post from '../components/Post'
import Reply from '../components/Reply'
import api from '../core/api'
import { Box } from '@material-ui/system'

const PostPage = () => {
  const { id } = useParams()
  const [parents, setParents] = useState([])
  const [post, setPost] = useState(useLocation().state?.post)
  const [replies, setReplies] = useState([])
  const authenticated = useSelector((state) => state.auth.authenticated)

  // Get post if doesn't exist
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

  // Get parent chain
  useEffect(() => {
    api
      .get(`posts/${id}/parents`)
      .then((res) => {
        setParents(res.data.posts)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [id])

  // Get direct replies
  useEffect(() => {
    api
      .get(`posts/${id}/replies`)
      .then((res) => {
        console.log(res)
        setReplies(res.data.posts)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [id])

  const date = new Date(post.created_at).toDateString()

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>

      {/* Parent chain */}
      {parents?.map((post) => (
        <Post key={post.id} post={post} variant='compact' sx={{ my: 3 }} />
      ))}

      <Post key={post.id} post={post} />
      
      {authenticated && (
        <Reply sx={{mt: 1}}/>
      )}
      {/* Direct replies */}
      {replies?.map((post) => (
        <Post key={post.id} post={post} variant='compact' sx={{ my: 3 }} />
      ))}
    </Container>
  )
}

export default PostPage
