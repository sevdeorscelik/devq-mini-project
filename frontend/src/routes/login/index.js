import * as React from 'react'
import './index.scss'
import Layout from '../../Layout'
import useUser from '../../hooks/useUser'
import { useNavigate } from 'react-router-dom'

export default function Login () {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [file, setFile] = React.useState();
  const [showRegister, setShowRegister] = React.useState(false)
  const [name, setName] = React.useState('')
  const user = useUser()
  const navigate = useNavigate()


  const handleLoginClick = async (e) => {
    e.preventDefault()
    const status = await user.login({
      email: email,
      password: password
    })

    if(status === 200) {
      navigate('/account')
    }
  }

  const handleRegisterClick = async (e) => {
    e.preventDefault()
    const status = await user.register({
      email: email,
      password: password,
      name: name,
	    file: file
    })

    if(status === 200) {
      navigate('/account')
    }
  }

  if(showRegister) {
    return (
      <Layout>
        <div className='Login'>
          <form className='box'  onSubmit={handleRegisterClick}>
            <h1>Register</h1>
            <hr/>
  
            <div className='input-group'>
              <div className='label'>Email</div>
              <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
  
            <div className='input-group'>
              <div className='label'>Password</div>
              <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
            </div>

            <div className='input-group'>
              <div className='label'>Name</div>
              <input type='text' value={name} placeholder='Name' onChange={e => setName(e.target.value)}/>
            </div>

			<div className='input-group'>
              <div className='label'>Profilbild</div>
              <input type='file' accept='image/*' placeholder='Profilbild' onChange={e => setFile(e.target.files[0])}/>
            </div>
  
            <div className='toggle-register' onClick={() => setShowRegister(false)}>
              Ich habe bereits einen Account
            </div>
  
            <button type='submit'>
              {user.isFetching ? 'fetching...' : 'Abschicken'}
            </button>
          </form>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className='Login'>
        <form className='box'  onSubmit={handleLoginClick}>
          <h1>Login</h1>
          <hr/>

          <div className='input-group'>
            <div className='label'>Email</div>
            <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
          </div>

          <div className='input-group'>
            <div className='label'>Password</div>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
          </div>

          <div className='toggle-register' onClick={() => setShowRegister(true)}>
            Ich habe noch keinen Account
          </div>

          <button type='submit'>
            {user.isFetching ? 'fetching...' : 'Abschicken'}
          </button>

          {user.error && (
            <div className='error'>{user.error}</div>
          )}
        </form>
      </div>
    </Layout>
  )
}