import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api, { media } from '../core/endpoints'
import {
  Avatar,
  Card,
  Stack,
  Button,
  Typography,
} from '@material-ui/core'
import { Box } from '@material-ui/system'

const User = ({ user }) => {

  const goToUserPage = () => {}
  
  return (
    <Card>
      <Stack direction="row">
        <Avatar variant="rounded-m" sx={{ mr: 2 }}
          onClick={goToUserPage}
          src={media + user.profile}
          alt={user.name}
        />
        <Stack justifyContent="center" onClick={goToUserPage}>
          <Stack direction="column" justifyContent="center">
            <Typography color="text.primary" fontWeight="600">
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.hint">
              {'@'}
              {user.username}
            </Typography>
          </Stack>
        </Stack>
        {/* Stats */}
        <Stack direction='row' alignItems='center' ml='auto'>
          <Typography variant='caption' fontWeight='500'>Followers</Typography>
          <Typography sx={{ml: 1}} variant='h5'>{user.followers_num}</Typography>
        </Stack>
          <Button 
            variant='contained' 
            color={user.is_following ? 'secondary' : 'primary'}
            sx={{alignSelf: 'center', ml: 1}}
          >
            {user.is_following ? "Unfollow" : 'Follow'}
          </Button>
      </Stack>
    </Card>
  )
}



export default User