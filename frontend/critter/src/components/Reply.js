import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Avatar,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
  Link,
  TextField,
  Button
} from '@material-ui/core'
import { Box } from '@material-ui/system'
import { Favorite, Loop } from '@material-ui/icons'
import Interactions from './Interactions'
import api from '../core/api'

const Reply = ({ sx, ...props }) => {
  const history = useHistory()
  const [text, setText] = useState('')
  const user = useSelector(state => state.auth?.user)

  const handleSubmit = e => {

  }

  return (
    <Card sx={sx} >
      <Stack direction="row" alignItems="flex-start" gap={1} >
        <Avatar
          sx={{
            backgroundColor: 'primary.main',
            mr: 1,
          }}
          alt={user.name}
          variant="rounded-m"
        >
          {user?.name[0]}
        </Avatar>
        <TextField
          variant="standard"
          fullWidth
          multiline
          rows={2}
          placeholder="Reply"
          onChange={(e) => setText(e.target.value)}
        />
        <Button variant='text' onClick={handleSubmit}>
          Post
        </Button>
      </Stack>
    </Card>
  )
}



export default Reply
