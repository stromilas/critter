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
import api from '../core/api'

const Post = ({ sx, post }) => {
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
    history.push(`/posts/${post.id}/`, { post })
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
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption">
            Replying to {" "}
            <Link onClick={(e) => goToUserPage(e, post.parent.user.username)}>
              @{post.parent.user.username}
            </Link>
          </Typography>
        </Box>
      )}
      {/* Text */}
      <Box sx={{ my: 3 }}>
        <Typography>{post.text}</Typography>
      </Box>
      {/* Likes & Shares */}
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle1">
        <Stack direction="row" gap="6px">
          <Typography fontWeight="600">{post.shares}</Typography>
          <Typography>shares</Typography>
          <Typography fontWeight="600">{post.likes}</Typography>
          <Typography>likes</Typography>
        </Stack>
      </Typography>
      {/* Share or Like */}
      <Divider sx={{ my: 1 }} />
      <Stack direction="row">
        <IconButton onClick={handleShare} edge="start">
          <Loop sx={{ color: shared ? 'primary.main' : 'text.hint' }} />
        </IconButton>
        <IconButton onClick={handleLike}>
          <Favorite sx={{ color: liked ? 'primary.main' : 'text.hint' }} />
        </IconButton>
      </Stack>
    </Card>
  )
}

export default Post
