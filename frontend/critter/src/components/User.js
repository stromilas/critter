import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api, { media } from '../core/endpoints'
import { Avatar, Card, Stack, Button, Typography } from '@material-ui/core'
import { Box } from '@material-ui/system'
import { useHistory } from 'react-router'

const User = ({ user }) => {
  const [following, setFollowing] = useState(user.is_following)
  const myId = useSelector((state) => state.auth?.user?.id)
  const authenticated = useSelector((state) => state.auth.authenticated)
  const history = useHistory()

  const goToUserPage = (e) => {
    e.stopPropagation()
    history.push(`/users/${user.username}`)
  }

  const setFollow = (boolean) => {
    api.post(`users/${user.username}/follow`, { follow: boolean })
    setFollowing(boolean)
  }

  return (
    <Card>
      <Stack direction="row">
        <Avatar
          variant="rounded-m"
          sx={{ mr: 2, cursor: 'pointer' }}
          onClick={goToUserPage}
          src={media + user.profile}
          alt={user.name}
        />
        <Stack justifyContent="center" onClick={goToUserPage} sx={{ cursor: 'pointer' }}>
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
        <Stack direction="row" alignItems="center" ml="auto" mr={2}>
          <Typography variant="caption" fontWeight="500">
            Followers
          </Typography>
          <Typography sx={{ ml: 1 }} variant="h5">
            {user.followers_num}
          </Typography>
        </Stack>

        {authenticated ? (
          myId != user.id &&
          (following ? (
            <Button
              variant="text"
              color="primary"
              onClick={() => setFollow(false)}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFollow(true)}
            >
              Follow
            </Button>
          ))
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push('/login')}
          >
            Follow
          </Button>
        )}
      </Stack>
    </Card>
  )
}

export default User
