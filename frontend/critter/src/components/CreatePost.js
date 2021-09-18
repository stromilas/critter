import React, { useState } from 'react'
import { Card, Typography, Divider, TextField, Stack, Avatar, Button } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { media } from '../core/endpoints'


const CreatePost = (props) => {
  const [text, setText] = useState('')
  const user = useSelector(state => state.auth?.user)

  const handleSubmit = () => {
    props.onSubmit(text)
    setText('')
  }

  return (
    <Card>
      <Typography>What's on your mind? 🥜</Typography>
      <Divider sx={{ my: 1 }} />
      <Stack direction="row">
        <Avatar
          sx={{
            backgroundColor: 'primary.main',
            mr: 1,
          }}
          src={media + user.profile}
          alt={user.name}
          variant="rounded-m"
        />
        <TextField
          variant="standard"
          fullWidth
          multiline
          rows={3}
          placeholder="Share your thoughts"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Stack>
      <Stack direction='row-reverse' sx={{ pt: 1 }}>
        <Button variant='contained' onClick={handleSubmit}>
          Post
        </Button>
      </Stack>
    </Card>
  )
}

export default CreatePost
