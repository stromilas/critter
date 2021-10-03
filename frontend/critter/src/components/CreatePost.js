import React, { useReducer, useState } from 'react'
import {
  Card,
  Typography,
  Divider,
  TextField,
  Stack,
  Avatar,
  Button,
  IconButton,
  LinearProgress,
} from '@material-ui/core'
import { PhotoCamera, Close } from '@material-ui/icons'
import { useSelector } from 'react-redux'
import { media } from '../core/endpoints'
import { Box } from '@material-ui/system'
import { api } from '../core/endpoints'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const fileReducer = (state, action) => {
  switch (action.type) {
    case 'uploadTick': {
      const files = [...state]
      const index = files.findIndex((file) => file.object.name == action.name)

      if (index == -1) {
        return state
      }
      const pct = Math.ceil((action.event.loaded / action.event.total) * 100)

      files[index].transfer = pct
      if (pct == 100) {
        files[index].transfered = true
      }

      return files
    }

    case 'add': {
      return [...state, action.file]
    }

    case 'remove': {
      return state.filter((file) => file.object.name != action.file.object.name)
    }

    case 'clear': {
      return []
    }

    default: {
      console.warn('Unknown action type')
    }
  }
}

const CreatePost = (props) => {
  const user = useSelector((state) => state.auth?.user)
  const [id, setId] = useState(uuidv4())
  const [post, setPost] = useState('')
  const [files, dispatch] = useReducer(fileReducer, [])

  const handleSubmit = () => {
    if (post.length < 5) {
      console.warn('Minimum 5 characters')
      return
    }
    props.onSubmit(id, post, files.map(file => file.object.name))
    setPost('')
    setId(uuidv4())
    dispatch({ type: 'clear' })
  }

  const addFiles = async (e) => {
    e.preventDefault()
    for (const file of e.target.files) {
      if (files.findIndex((_file) => _file.object.name == file.name) != -1) {
        console.warn('File already added')
        return
      }
      const data = await readFile(file)
      const signedUrl = await getSignedUrl(id, file.name)

      const config = {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (event) =>
          dispatch({ type: 'uploadTick', event: event, name: file.name }),
      }

      axios.put(signedUrl, data, config)

      const _file = {
        object: file,
        transfer: 0,
        transfered: false,
        url: URL.createObjectURL(file),
      }

      dispatch({ type: 'add', file: _file })
    }
  }

  const removeFile = (file) => {
    dispatch({ type: 'remove', file })
    URL.revokeObjectURL(file.url)
  }

  return (
    <Card>
      <Typography>What's on your mind? 🥜</Typography>
      <Divider sx={{ my: 1 }} />
      <Stack direction="row">
        <Avatar
          sx={{
            backgroundColor: 'primary.main',
            mr: 1,
          }}
          src={media + user.profile}
          alt={user.name}
          variant="rounded-m"
        />
        <TextField
          variant="standard"
          fullWidth
          multiline
          rows={3}
          placeholder="Share your thoughts"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
      </Stack>
      <Stack direction="row-reverse" sx={{ pt: 1 }}>
        {/* Submit Post */}
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={files.some(file => !file.transfered)}  
        >
          Post
        </Button>
        {/* Add media */}
        <label htmlFor="icon-button-file" >
          <input
            id="icon-button-file"
            type="file"
            onChange={addFiles}
            accept="image/*"
            multiple
            hidden
          />
          <IconButton
            color="primary"
            aria-label="upload media"
            component="span"
            sx={{mr: 2}}
          >
            <PhotoCamera />
          </IconButton>
        </label>
      </Stack>
      <Stack
        direction="row"
        gap={1}
        flexWrap="wrap"
        sx={{ mt: 1, width: '100%' }}
      >
        {files.map((file) => (
          <ImagePreview
            key={file.object.name}
            file={file}
            onRemove={(file) => removeFile(file)}
          />
        ))}
      </Stack>
    </Card>
  )
}

const ImagePreview = ({ file, onRemove }) => {
  return (
    <Box
      sx={{
        maxHeight: '180px',
        maxWidth: '220px',
        position: 'relative',
        borderRadius: '5px',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={file.url}
        sx={{
          width: '100%',
          height: '100%',
          filter: !file.transfered && 'brightness(.3)',
        }}
      />
      <IconButton
        onClick={() => onRemove(file)}
        component="div"
        sx={{ top: '5px', left: '5px', position: 'absolute' }}
      >
        <Close />
      </IconButton>
      <LinearProgress
        variant="determinate"
        value={file.transfer}
        sx={{
          display: file.transfered ? 'none' : 'block',
          position: 'absolute',
          bottom: '0',
          width: '100%',
          height: '6px',
        }}
      />
    </Box>
  )
}

const readFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => resolve(reader.result)
    reader.readAsArrayBuffer(file)
  })
}

const getSignedUrl = async (id, fileName) => {
  const config = { params: { id: id, file: fileName } }
  const signedUrl = (await api.get('/posts/media-endpoint', config))?.data

  if (!signedUrl) {
    console.warn('Failed to retrieve pre-signed URL')
    return null
  }

  return signedUrl
}

export default CreatePost
