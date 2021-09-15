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


export const Interactions = ({ variant = 'normal', ...props }) => {

  const components = {
    'normal': <Normal {...props} />,
    'compact': <Compact {...props} />,
  }

  return components[variant]
}

export const Normal = (props) => {

  return (
    <Box>
      {/* Likes & Shares */}
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle1">
        <Stack direction="row" gap="6px">
          <Typography fontWeight="600">{props.shares}</Typography>
          <Typography>shares</Typography>
          <Typography fontWeight="600">{props.likes}</Typography>
          <Typography>likes</Typography>
        </Stack>
      </Typography>
      {/* Share or Like */}
      <Divider sx={{ my: 1 }} />
      <Stack direction="row">
        <IconButton onClick={props.handleShare} edge="start">
          <Loop sx={{ color: props.shared ? 'primary.main' : 'text.hint' }} />
        </IconButton>
        <IconButton onClick={props.handleLike}>
          <Favorite sx={{ color: props.liked ? 'primary.main' : 'text.hint' }} />
        </IconButton>
      </Stack>
    </Box>
  )
}

export const Compact = (props) => {

  return (
    <Box>
      <Divider />
      <Stack direction="row" alignItems="center" gap={1}>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={props.handleShare} edge="start" >
            <Loop sx={{ color: props.shared ? 'primary.main' : 'text.hint', height: 20, width: 20 }} />
          </IconButton>
          <Typography variant="caption">
            {props.shares}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={props.handleLike}>
            <Favorite sx={{ color: props.liked ? 'primary.main' : 'text.hint', height: 20, width: 20  }} />
          </IconButton>
          <Typography variant="caption">
            {props.likes}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default Interactions