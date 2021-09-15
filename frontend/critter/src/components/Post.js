import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Avatar,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
  Link
} from '@material-ui/core'
import { Box } from '@material-ui/system'
import { Favorite, Loop } from '@material-ui/icons'
import Interactions from './Interactions'
import api from '../core/api'

const Post = ({ sx, post, variant = 'normal' }) => {
  const [liked, setLiked] = useState(post.liked)
  const [shared, setShared] = useState(post.shared)
  const history = useHistory()

  const handleLike = (e) => {
    e.stopPropagation()
    const liking = !liked
    setLiked(liking)
    api.post(`posts/${post.id}/like`, { set: liking }).catch((e) => {
      console.error(e)
      setLiked(!liking)
    })
  }

  const handleShare = (e) => {
    e.stopPropagation()
    const sharing = !shared
    setShared(sharing)
    api.post(`posts/${post.id}/share`, { set: sharing }).catch((e) => {
      console.error(e)
      setShared(!sharing)
    })
  }

  const goToUserPage = (e, username) => {
    e.stopPropagation()
    history.push(`users/${username}`)
  }

  const goToPostPage = (e) => {
    history.push(`/posts/${post.id}/`)
  }

  const date = new Date(post.created_at).toDateString()
  return (
    <Card onClick={goToPostPage} sx={{ cursor: 'pointer', ...sx }}>

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
      
      {post.parent && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption">
            Replying to {" "}
            <Link onClick={(e) => goToUserPage(e, post.parent.user.username)}>
              @{post.parent.user.username}
            </Link>
          </Typography>
        </Box>
      )}
      {/* Text */}
      <Box sx={{ my: 2 }}>
        <Typography>{post.text}</Typography>
      </Box>
      <Interactions 
        shares={post.shares}
        likes={post.likes}
        shared={shared}
        liked={liked}
        handleShare={handleShare}
        handleLike={handleLike}
        variant={variant}
      />
    </Card>
  )
}



export default Post
