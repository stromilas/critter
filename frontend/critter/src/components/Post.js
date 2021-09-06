import React, { useState } from 'react'
import {
  Avatar,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@material-ui/core'
import { Box } from '@material-ui/system'
import { Favorite, Loop } from '@material-ui/icons'
import api from '../core/api'

const Post = (props) => {
  const [liked, setLiked] = useState(props.liked)
  const [shared, setShared] = useState(props.shared)

  const handleLike = () => {
    const liking = !liked
    setLiked(liking)
    api.post(`posts/${props.id}/like`, { set: liking }).catch((e) => {
      console.error(e)
      setLiked(!liking)
    })
  }

  const handleShare = () => {
    const sharing = !shared
    setShared(sharing)
    api.post(`posts/${props.id}/share`, { set: sharing }).catch((e) => {
      console.error(e)
      setShared(!sharing)
    })
  }

  const date = new Date(props.created_at).toDateString()
  return (
    <Card>
      <Stack direction="row">
        <Avatar variant="rounded-m" sx={{ mr: 2 }}>
          {props.name[0]}
        </Avatar>
        <Stack justifyContent="center">
          <Typography color="text.primary" fontWeight="600">
            {props.name}
          </Typography>
          <Typography color="text.hint" variant="caption">
            {date}
          </Typography>
        </Stack>
      </Stack>
      {/* Text */}
      <Box sx={{ my: 3 }}>
        <Typography>{props.text}</Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle1">
        <Stack direction="row" gap="6px">
          <Typography fontWeight="600">{props.shares}</Typography>
          <Typography>shares</Typography>
          <Typography fontWeight="600">{props.likes}</Typography>
          <Typography>likes</Typography>
        </Stack>
      </Typography>
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
