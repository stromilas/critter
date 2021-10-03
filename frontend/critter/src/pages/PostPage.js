import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { Avatar, Card, Container, Stack, Typography } from '@material-ui/core'
import Post from '../components/Post'
import Reply from '../components/Reply'
import api from '../core/endpoints'
import { Box } from '@material-ui/system'
import { media } from '../core/endpoints'

const PostPage = () => {
  const { id } = useParams()
  const [parents, setParents] = useState([])
  const [post, setPost] = useState()
  const [replies, setReplies] = useState([])
  const [trigger, setTrigger] = useState(false)
  const authenticated = useSelector((state) => state.auth.authenticated)

  // Get post if doesn't exist
  useEffect(() => {
    api
      .get(`posts/${id}`)
      .then((res) => {
        setPost(res.data.post)
      })
      .catch((e) => {
        console.error(e)
        // TODO: Show notification
      })

  }, [id])

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
        setReplies(res.data.posts)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [id, trigger])

  const handleSubmit = (text) => {
    const data = { post: { text } }
    api
      .post(`posts/${id}/replies`, data)
      .then((res) => {
        setTrigger(!trigger)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      {/* Parent chain */}
      {parents?.map((post) => (
        <Post key={post.id} post={post} variant="compact" sx={{ my: 3 }} />
      ))}

      {/* Main post */}
      {post && (
        <Post key={post.id} post={post} />
      )}

      {/* Allow to reply if authenticated */}
      {authenticated && <Reply sx={{ mt: 1 }} onSubmit={handleSubmit} />}

      {/* Direct replies */}
      {replies?.map((post) => (
        <Post key={post.id} post={post} variant="compact" sx={{ my: 3 }} />
      ))}
    </Container>
  )
}

export default PostPage
