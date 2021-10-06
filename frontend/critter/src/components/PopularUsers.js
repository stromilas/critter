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
import User from './User'

const PopularUsers = (props) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/users/popular')
      .then(res => {
        setUsers(res.data.users)
      })
      .catch(e => console.error(e))
  }, [])

  return (
    <>
      {users.map(user => (
        <User key={user.id} user={user} />
      ))}
    </>
  )
}



export default PopularUsers