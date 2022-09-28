import * as React from 'react'
import './index.scss'
import Layout from '../../Layout'
import useUser from '../../hooks/useUser'
import { useNavigate } from 'react-router-dom'

export default function Account () {
  const user = useUser()
  const navigate = useNavigate()
  const [name, setName] = React.useState(user.data.name)
  const [profilePic, setProfilePic] = React.useState('')
  const [showSuccess, setShowSuccess] = React.useState(false)

  const handleLogout = async () => {
    await user.logout()
    navigate('/login')
  }

  const handleUpdate = async e => {
    e.preventDefault()
    const status = await user.update({
      name,
      profilePic
    })

    if(status === 200) {
      setShowSuccess(true)
  
      setTimeout(() => {
        setShowSuccess(false)
      }, 4000)
    }
  }

  return (
    <Layout>
      <div className='Account'>

        <div className='title'>
          <h1>Das bin Ich</h1>
		      <button onClick={handleLogout}>logout</button>
        </div>
		
        <form className='update-box' onSubmit={handleUpdate}>
          <div className='input-group'>
            <span>Name</span>
            <input type='text' placeholder='Name...' value={name} onChange={e => setName(e.target.value)}/>
          </div>
          <div className='input-group'>
            <span>Avatar</span>
            <input type='file' accept='image/*' placeholder='Profilbild...' onChange={e => setProfilePic(e.target.files[0])}/>
          </div>
          <button>
            {user.isFetching ? 'fetching...' : 'Updaten'}
          </button>
          {user.error && <div className='error'>{user.error}</div>}
          {showSuccess && <div className='success'>Update war erfolgreich</div>}
        </form>

      </div>
    </Layout>
  )
}