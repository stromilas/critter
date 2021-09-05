import React from 'react'
import { Avatar, Card, Stack, Typography } from '@material-ui/core'
import { Box } from '@material-ui/system'

const Post = (props) => {
  const date = new Date(props.created_at).toDateString()

  return (
    <Card>
      <Stack direction="row">
        <Avatar 
          variant="rounded-m" 
          sx={{ mr: 2 }}  
        >
          {props.user.name[0]}
        </Avatar>
        <Stack justifyContent='center'>
          <Typography color='text.primary' fontWeight='600'>
            {props.user.name}
          </Typography>
          <Typography color='text.hint' variant='caption' >
            {date}
          </Typography>
        </Stack>
      </Stack>
      <Box sx={{mt: 2}}>
        <Typography>
          {props.text}
        </Typography>
      </Box>
    </Card>
  )
}

export default Post