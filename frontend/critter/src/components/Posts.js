import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router'
import api from '../core/endpoints'
import Post from './Post'

const Posts = ({ username, likes }) => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const data = {
      params: {
        likes
      }
    }
    api
      .get(`users/${username}/posts`, data)
      .then(res => {
        setPosts(res.data.posts)
      })
      .catch(e => {
        console.error(e)
      })
  }, [username, likes])
  
  return (
    <>
      {posts.map(post => (
        <Post post={post} />
      ))}
    </>
  )
}

export default Posts