import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  CircularProgress,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import { Switch, Link, Route } from 'react-router-dom'
import CreatePost from '../components/CreatePost'
import Post from '../components/Post'
import { Redirect, useHistory, useLocation, useParams, useRouteMatch } from 'react-router'
import { Box } from '@material-ui/system'
import Posts from '../components/Posts'
import api, { media } from '../core/endpoints'

const ExplorePage = () => {
  const { username } = useParams()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const myId = useSelector((state) => state.auth?.user?.id)
  const authenticated = useSelector((state) => state.auth.authenticated)
  const { url } = useRouteMatch()
  const { pathname } = useLocation()
  const history = useHistory()

  // useEffect(() => {
  //   api
  //     .get(`users/${username}`)
  //     .then((res) => {
  //       setUser(res.data.user)
  //       console.log(res.data.user)
  //       setFollowing(res.data.user.is_following)
  //       setLoading(false)
  //     })
  //     .catch((e) => {
  //       console.error(e)
  //     })
  // }, [username])

  return (
    <>
      WIP
    </>
  )
}

export default ExplorePage