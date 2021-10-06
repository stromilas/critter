import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Avatar,
  Card,
  Stack,
  Typography,
  Link
} from '@material-ui/core'
import { Box } from '@material-ui/system'
import Interactions from './Interactions'
import api from '../core/endpoints'
import { media } from '../core/endpoints'

const Post = ({ sx, post, variant = 'normal' }) => {
  const [liked, setLiked] = useState(post.liked)
  const [shared, setShared] = useState(post.shared)
  const [saved, setSaved] = useState(post.saved)
  const history = useHistory()

  const handleLike = (e) => {
    e.stopPropagation()
    const liking = !liked
    setLiked(liking)
    api.post(`posts/${post.id}/like`, { set: liking }).catch((e) => {
      console.error(e)
      setLiked(!liking)
    })
  }

  const handleShare = (e) => {
    e.stopPropagation()
    const sharing = !shared
    setShared(sharing)
    api.post(`posts/${post.id}/share`, { set: sharing }).catch((e) => {
      console.error(e)
      setShared(!sharing)
    })
  }

  const handleSave = (e) => {
    e.stopPropagation()
    const saving = !saved
    setSaved(saving)
    api.post(`posts/${post.id}/save`, { set: saving }).catch((e) => {
      console.error(e)
      setSaved(!saving)
    })
  }

  const goToUserPage = (e) => {
    e.stopPropagation()
    const username = post.user?.username
    if(username) {
      history.push(`/users/${username}`)
    }
  }

  const goToPostPage = () => {
    history.push(`/posts/${post.id}/`)
  }

  const openImage = (e, file) => {
    e.stopPropagation()
    window.open(`${process.env.REACT_APP_PUBLIC_URL}posts/${post.user.username}/${post.id}/${file.file_name}`, '_blank')
  }

  const date = new Date(post.created_at).toDateString()
  return (
    <Card onClick={goToPostPage} sx={{ cursor: 'pointer', ...sx }}>
      {/* Profile */}
      <Stack direction="row">
        <Avatar variant="rounded-m" sx={{ mr: 2 }}
          onClick={goToUserPage}
          src={media + post.user.profile}
          alt={post.user.name}
        />
        <Stack justifyContent="center" onClick={goToUserPage}>
          <Stack direction="row" gap="3px" alignItems="center">
            <Typography color="text.primary" fontWeight="600">
              {post.user.name}
            </Typography>
            <Typography variant="caption" color="text.hint">
              {'@'}
              {post.user.username}
            </Typography>
          </Stack>
          <Typography color="text.hint" variant="caption">
            {date}
          </Typography>
        </Stack>
      </Stack>
      {/* Conditional | Replying to */}
      {post.parent && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption">
            Replying to {" "}
            <Link onClick={goToUserPage}>
              @{post.parent.user.username}
            </Link>
          </Typography>
        </Box>
      )}
      {/* Text */}
      <Box sx={{ my: 2 }}>
        <Typography>{post.text}</Typography>
      </Box>
      {/* Conditional | Media */}
      <Stack direction='row' gap={1} flexWrap='wrap'>
        {post.media?.map(file => (
          <Box 
            key={file.file_name}
            src={`${process.env.REACT_APP_PUBLIC_URL}posts/${post.user.username}/${post.id}/${file.file_name}`}
            component="img"
            loading='lazy'
            sx={{ objectFit: 'cover', height: 200, width: 'auto' }}
            onClick={(e) => openImage(e, file)}
          />
        ))}
      </Stack>
      <Interactions 
        shares={post.shares}
        likes={post.likes}
        shared={shared}
        liked={liked}
        saved={saved}
        handleShare={handleShare}
        handleLike={handleLike}
        handleSave={handleSave}
        variant={variant}
      />
    </Card>
  )
}

export default Post