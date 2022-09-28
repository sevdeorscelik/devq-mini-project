import * as React from 'react'
import './index.scss';
import Layout from '../../Layout';
import { Link } from 'react-router-dom';


export default function Overview () {
  const [questions, setQuestions] = React.useState([])
  const [category, setCategory] = React.useState('')
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetch(`http://localhost:3003/questions?category=${category}&search=${search}`)
      .then(async res => {
        const result = await res.json()

        if(res.status === 200) {
          setQuestions(result)
        }
      })
  }, [category, search])

  const handleCategoryClick = selectedCategory => {
    if(selectedCategory === category) {
      setCategory('')
    }
    else {
      setCategory(selectedCategory)
    }
  }

  
  console.log(questions);

  return (
    <Layout>
      <div className='Overview'>
        <h1>Fragen</h1>

        
        <div className='filters'>
          <input type='text' placeholder='Search...' value={search} onChange={e => setSearch(e.target.value)}/>

          <div className='categories'>
            <button 
              className={category === 'js' ? 'active' : ''}
              onClick={() => handleCategoryClick('js')}>JS</button>
            <button 
              className={category === 'css' ? 'active' : ''}
              onClick={() => handleCategoryClick('css')}>CSS</button>
            <button 
              className={category === 'html' ? 'active' : ''}
              onClick={() => handleCategoryClick('html')}>HTML</button>
          </div>
        </div>


        <div className='questions'>
          {questions.map(question => (
            <Link className='question' key={question._id} to={'/questions/'+question._id}>
              <h4>{question.title}</h4>
			  <p>{question.answers.length} Antworten</p>
			  <div className="profile">
			  {question.user.profileImage && <div><img className="profileImage" src={question.user.profileImage} width="24" height="24" alt="Profilbild" /></div>}
              <div><p>&nbsp;{question.user.name}</p></div>
			  </div>
        {question.category && <div className='container-category'><button className='category'>{question.category}</button></div>}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}