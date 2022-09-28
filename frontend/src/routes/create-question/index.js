import * as React from 'react'
import './index.scss'
import Layout from '../../Layout'
import { useNavigate } from 'react-router-dom'

export default function CreateQuestion () {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [error, setError] = React.useState('')
  const [category, setCategory] = React.useState('html')
  const [isFetching, setIsFetching] = React.useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsFetching(true)
    
    const res = await fetch('http://localhost:3003/questions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        description: description,
        category: category
      })
    })

    const result = await res.json()
    setIsFetching(false)
    

    if(res.status === 200) {
      // weiterleiten
      navigate('/questions/' + result._id)
    }
    else if(result.errors) {
      // validation error
      setError(result.errors[0].msg)
    }
    else if(result.error) {
      // server error
      setError(result.error)
    }
  }

  const handleCategoryClick = category => {
    return e => {
      e.preventDefault()
      e.stopPropagation() // event wird hier beendet. das formular bekommt keinen klick
      setCategory(category)
    }
  }

  return (
    <Layout>
      <form className='CreateQuestion' onSubmit={handleSubmit}>
        <h2>Title</h2>
        <input placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}/>

        <h2>Beschreibung</h2>
        <textarea rows={20} value={description} onChange={e => setDescription(e.target.value)}/>

        <h2>Kategorie</h2>
        <div className='button-list'>
          <button 
            className={category === 'html' ? 'active' : ''}
            onClick={handleCategoryClick('html')}>HTML</button>
          <button 
            className={category === 'js' ? 'active' : ''}
            onClick={handleCategoryClick('js')}>JS</button>
          <button 
            className={category === 'css' ? 'active' : ''}
            onClick={handleCategoryClick('css')}>CSS</button>
        </div>

        <button>{isFetching ? 'fetching...' : 'Absenden'}</button>
        {error && ( <div className='error'>{error}</div> )}
      </form>
    </Layout>
  )
}