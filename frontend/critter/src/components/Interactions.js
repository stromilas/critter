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
import { Favorite, Loop, Bookmark } from '@material-ui/icons'
import api from '../core/endpoints'
import { useSelector } from 'react-redux'


export const Interactions = ({ variant = 'normal', ...props }) => {

  const components = {
    'normal': <Normal {...props} />,
    'compact': <Compact {...props} />,
  }

  return components[variant]
}

export const Normal = (props) => {
  const [likes, setLikes] = useState(props.likes)
  const [shares, setShares] = useState(props.shares)
  const authenticated = useSelector((state) => state.auth.authenticated)

  const updateShares = (e, digit) => {
    e.stopPropagation()
    if (authenticated) {
      setShares(shares + digit)
      props.handleShare(e)
    }
  }

  const updateLikes = (e, digit) => {
    e.stopPropagation()
    if (authenticated) {
      setLikes(likes + digit)
      props.handleLike(e)
    }
  }

  const save = (e) => {
    e.stopPropagation()
    props.handleSave(e)
  }
  
  return (
    <Box>
      {/* Likes & Shares */}
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle1">
        <Stack direction="row" gap="6px">
          <Typography fontWeight="600">{shares}</Typography>
          <Typography>shares</Typography>
          <Typography fontWeight="600">{likes}</Typography>
          <Typography>likes</Typography>
        </Stack>
      </Typography>
      {/* Share / Like / Saved */}
      <Divider sx={{ my: 1 }} />
      <Stack direction="row">
        <IconButton onClick={(e) => updateShares(e, props.shared ? -1 : 1)} edge="start">
          <Loop sx={{ color: props.shared ? 'primary.main' : 'text.hint' }} />
        </IconButton>
        <IconButton onClick={(e) => updateLikes(e, props.liked ? -1 : 1)}>
          <Favorite sx={{ color: props.liked ? 'primary.main' : 'text.hint' }} />
        </IconButton>
        <IconButton onClick={save}>
          <Bookmark sx={{ color: props.saved ? 'primary.main' : 'text.hint' }} />
        </IconButton>
      </Stack>
    </Box>
  )
}

export const Compact = (props) => {
  const [likes, setLikes] = useState(props.likes)
  const [shares, setShares] = useState(props.shares)
  const authenticated = useSelector((state) => state.auth.authenticated)

  const updateShares = (e, digit) => {
    e.stopPropagation()
    if (authenticated) {
      setShares(shares + digit)
      props.handleShare(e)
    }
  }

  const updateLikes = (e, digit) => {
    e.stopPropagation()
    if (authenticated) {
      setLikes(likes + digit)
      props.handleLike(e)
    }
  }

  const save = (e) => {
    e.stopPropagation()
    props.handleSave()
  }


  return (
    <Box>
      <Divider />
      <Stack direction="row" alignItems="center" gap={1}>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={(e) => updateShares(e, props.shared ? -1 : 1)} edge="start" >
            <Loop sx={{ color: props.shared ? 'primary.main' : 'text.hint', height: 20, width: 20 }} />
          </IconButton>
          <Typography variant="caption">
            {shares}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={(e) => updateLikes(e, props.liked ? -1 : 1)}>
            <Favorite sx={{ color: props.liked ? 'primary.main' : 'text.hint', height: 20, width: 20  }} />
          </IconButton>
          <Typography variant="caption">
            {likes}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default Interactions