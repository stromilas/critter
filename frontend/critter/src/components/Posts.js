import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router'
import api from '../core/endpoints'
import Post from './Post'

const Posts = ({ username }) => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api
      .get(`users/${username}/posts`)
      .then(res => {
        setPosts(res.data.posts)
      })
      .catch(e => {
        console.error(e)
        // TODO: Show notification
      })
  }, [username])

  console.log(posts);
  
  return (
    <>
      {posts.map(post => (
        <Post post={post} />
      ))}
    </>
  )
}

export default Posts