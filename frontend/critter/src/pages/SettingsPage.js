import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core'
import { InsertPhoto } from '@material-ui/icons'
import { Switch, Link, Route } from 'react-router-dom'
import {
  Redirect,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router'
import api, { media } from '../core/endpoints'
import { readFile } from '../utils/file'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/system'
import axios from 'axios'

const SettingsPage = () => {
  const { url } = useRouteMatch()
  const { pathname } = useLocation()
  const user = useSelector((state) => state.auth.user)

  const [profile, setProfile] = useState(user.profile)
  const [banner, setBanner] = useState(user.banner)
  const [name, setName] = useState(user.name)
  const [changed, setChanged] = useState(false)
  
  const addImage = async (e, type, setImage) => {
    const file = e.target.files?.[0]
    if (!file) { return }
    const data = await readFile(file)

    let config = {
      params: {
        file: file.name,
        media: type
      }
    }
    const signedUrl = (await api.get('/users/media-endpoint', config))?.data
    if (!signedUrl) {
      console.error('Failed to fetch signed url')
      return
    }

    config = { headers: { 'Content-Type': file.type } }
    axios.put(signedUrl, data, config)
      .then(res => setImage(`users/${type}/${user.username}/${file.name}`))
    setChanged(true)
  }

  const handleSubmit = () => {
    const data = {
      profile: profile,
      banner: banner,
      name: name,
    }
    api.put('/users/me', data)
      .catch(e => console.error(e))
    setChanged(false)
  }

  return (
    <>
      <Container sx={{ position: 'relative' }}>
        <Stack direction="row" justifyContent="center" gap={2} sx={{ mt: 2 }}>
          {/* Side Menu */}
          <Card sx={{ width: { xs: 200, md: 300 }, height: '100%', pr: 0 }}>
            <Tabs value={pathname} orientation="vertical" scrollButtons={false}>
              <Tab
                label="Profile"
                value={`${url}/profile`}
                to={`${url}/profile`}
                component={Link}
                sx={{ color: 'inherit', mr: 2 }}
              />
            </Tabs>
          </Card>
          {/* Contents */}
          <Stack direction="column" gap={2} width="100%" maxWidth="sm">
            <Switch>
              <Route path={url} exact>
                <Redirect to={`${url}/profile`} />
              </Route>
              <Route path={`${url}/profile`}>
                <Card>
                  <Stack spacing={2}>
                    <Stack justifyContent="flex-start">
                      <Typography>
                        Profile Image
                        <label htmlFor="profile-image">
                          <input
                            id="profile-image"
                            type="file"
                            onChange={(e) => addImage(e, 'profile', setProfile)}
                            accept="image/*"
                            multiple
                            hidden
                          />
                          <IconButton
                            color="primary"
                            aria-label="upload media"
                            component='span'
                            sx={{ml: .5}}
                          >
                            <InsertPhoto />
                          </IconButton>
                        </label>  
                      </Typography>
                      <Avatar
                        variant="rounded-l"
                        src={media + profile}
                        alt={user.name}
                      />
                    </Stack>
                    <Stack>
                      <Typography>
                        Banner
                        <label htmlFor="icon-button-file">
                          <input
                            id="icon-button-file"
                            type="file"
                            onChange={(e) => addImage(e, 'banner', setBanner)}
                            accept="image/*"
                            multiple
                            hidden
                          />
                          <IconButton
                            color="primary"
                            aria-label="upload media"
                            component='span'
                            sx={{ml: .5}}
                          >
                            <InsertPhoto />
                          </IconButton>
                        </label>    
                      </Typography>
                      <Box
                        component="img"
                        src={media + banner}
                        sx={{
                          alignSelf: 'flex-start',
                          objectFit: 'contain',
                          maxHeight: '360px',
                          maxWidth: '100%'
                        }}
                      />
                    </Stack>
                    <Button 
                      variant="contained" 
                      sx={{ width: 'fit-content' }} 
                      disabled={!changed}
                      onClick={handleSubmit}
                    >
                      Save
                    </Button>
                  </Stack>
                </Card>
              </Route>
            </Switch>
          </Stack>
        </Stack>
      </Container>
    </>
  )
}

export default SettingsPage
