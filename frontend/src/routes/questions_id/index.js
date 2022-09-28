import * as React from 'react'
import './index.scss'
import { useParams } from 'react-router-dom'
import Layout from '../../Layout'

export default function Question () {
  const params = useParams()
  const [question, setQuestion] = React.useState(null)
  const [answer, setAnswer] = React.useState('')

  React.useEffect(() => {
    fetch('http://localhost:3003/questions/' + params.id, {
      method: 'GET',
      credentials: 'include'
    })
    .then(async res => {
      const result = await res.json()

      if(res.status === 200) {
        setQuestion(result)
      }
    })
  }, [params.id])

  const handleAnswerSubmit = async e => {
    e.preventDefault()
    
    const res = await fetch('http://localhost:3003/answers', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: answer,
        question: question._id
      })
    })

    if(res.status === 200) {
      setAnswer('')

      // refetch question
      fetch('http://localhost:3003/questions/' + params.id, {
        method: 'GET',
        credentials: 'include'
      })
      .then(async res => {
        const result = await res.json()

        if(res.status === 200) {
          setQuestion(result)
        }
      })
    }
  }

  if(!question) {
    return (
      <Layout>
        <h2>fetching...</h2>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className='QuestionId'>
        <div className='title'>
          <h1>{question.title}</h1>
		  <div className="profile">
		  	{question.user.profileImage && <div><img className="profileImage" src={question.user.profileImage} width="24" height="24" alt="Profilbild" /></div>}
          	<div className='name'>&nbsp; {question.user.name}</div>
		  </div>
        </div>
        <p className='description'>{question.description}</p>

        <div className='answers'>
          {question.answers.map((answer) => (
			<div key={answer._id}> 
				<div className="profile">
					{answer.user.profileImage && <div><img className="profileImage" src={answer.user.profileImage} width="24" height="24" alt="Profilbild" /></div>}
					<div className="annotation"><em>&nbsp;{answer.user.name} hat geantwortet:</em></div>
				</div>
            	<p>{answer.description}</p>
			</div>
          ))}
        </div>

        <hr/>

        <form onSubmit={handleAnswerSubmit}>
          <h2>Meine Antwort</h2>
          <textarea rows={10} value={answer} onChange={e => setAnswer(e.target.value)}/>
          <button>Abschicken</button>
        </form>
      </div>
    </Layout>
  )
}