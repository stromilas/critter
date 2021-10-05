import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api, { media } from '../core/endpoints'
import {
  Avatar,
  Card,
  Stack,
  TextField,
  Button
} from '@material-ui/core'
import Post from './Post'

const LatestPosts = (props) => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api.get('/posts/latest')
      .then(res => {
        setPosts(res.data.posts)
      })
      .catch(e => console.error(e))
  }, [])

  console.log(posts)

  return (
    <>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </>
  )
}



export default LatestPosts