import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { Card } from '@material-ui/core'
import api from '../core/api'

const PostPage = (props) => {
  const { id } = useParams()
  const [post, setPost] = useState(useLocation().post)
  const [replies, setReplies] = useState([])

  console.log(post)

  useEffect(() => {
    if (!post) {
      api.get(`posts/${id}`)
        .then(res => {

        })
        .catch(e => {
          console.error(e)
          // TODO: Show notification
        })
    }
  }, [post])

  return (
    <Card>
      Wooowwee {id}
    </Card>
  )
}

export default PostPage