import React, { useState } from 'react'
import {
  Card,
  Typography,
  Divider,
  TextField,
  Stack,
  Avatar,
  Button,
  Input,
  IconButton,
} from '@material-ui/core'
import { PhotoCamera, Close } from '@material-ui/icons'
import { useSelector } from 'react-redux'
import { media } from '../core/endpoints'
import { Box } from '@material-ui/system'

const CreatePost = (props) => {
  const [text, setText] = useState('')
  const user = useSelector((state) => state.auth?.user)
  const [files, setFiles] = useState([])

  const handleSubmit = () => {
    props.onSubmit(text)
    setText('')
  }

  const addFiles = (e) => {
    const _files = []
    for (const file of e.target.files) {
      _files.push({
        object: file,
        url: window.URL.createObjectURL(file),
      })
    }
    setFiles([...files, ..._files])
  }

  const removeFile = (file) => {
    window.URL.revokeObjectURL(file.url)
    const _files = files.filter(_file => _file != file)
    setFiles(_files)
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
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Stack>
      <Stack direction="row-reverse" sx={{ pt: 1 }}>
        {/* Submit Post */}
        <Button variant="contained" onClick={handleSubmit}>
          Post
        </Button>
        {/* Add media */}
        <label htmlFor="icon-button-file">
          <Input
            type="file"
            id="icon-button-file"
            sx={{ display: 'none' }}
            onChange={addFiles}
            accept="image/*"
            multiple={true}
          />
          <IconButton
            color="primary"
            aria-label="upload media"
            component="span"
          >
            <PhotoCamera />
          </IconButton>
        </label>
      </Stack>
      <Stack direction='row' gap={ 1} flexWrap='wrap' sx={{mt: 1, width: '100%'}}>
        {files.map((file) => (
          <ImagePreview
            key={file.url}
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
        overflow: 'hidden'
      }}
    >
      <Box
        component='img'
        src={file.url}
        sx={{ width: '100%', height: '100%' }}
      />
      <IconButton
        onClick={() => onRemove(file)}
        component="div"
        sx={{ top: '5px', left: '5px', position: 'absolute' }}
      >
        <Close />
      </IconButton>
    </Box>
  )
}

export default CreatePost
