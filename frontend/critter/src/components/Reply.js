import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Avatar,
  Card,
  Stack,
  TextField,
  Button
} from '@material-ui/core'

const Reply = ({ sx, ...props }) => {
  const [text, setText] = useState('')
  const user = useSelector(state => state.auth?.user)

  const handleSubmit = () => {
    props.onSubmit(text)
    setText('')
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
          value={text}
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
