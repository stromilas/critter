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

const TopPosts = ({ hasMedia = false}) => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const config = {
      params: {
        media: hasMedia
      }
    }
    api.get('/posts/top', config)
      .then(res => {
        setPosts(res.data.posts)
      })
      .catch(e => console.error(e))
  }, [hasMedia])

  console.log(posts)

  return (
    <>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </>
  )
}



export default TopPosts