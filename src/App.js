import React, { Component } from 'react';
import './index.css'
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import Results from './components/Results';
import Search from './components/Search';
import MultiSearch from './components/MultiSearch';
import RandomTopic from './components/RandomTopic';
// import { major, grade, bc, bc_topic, dpr, dpr_topic, topic } from './dummy/data.json';
import logo from './styles/logo.png'
import user from './styles/user.png'
import axios from 'axios'

// const bcdpr = [...bc_topic, ...dpr_topic]
// const random = bcdpr[Math.floor(Math.random() * bcdpr.length)]

// const filter = random.hasOwnProperty('bc_id') ? bc.filter((bc) => bc.id === random.bc_id) : dpr.filter((dpr) => dpr.id === random.dpr_id)
// const fixed = filter.length > 0 ? filter[0] : null
// const category = topic.filter((topic) => topic.id == random.topic_id)
// let badword = ['kasar','kotor','jelek','jorok']


class App extends Component {
  constructor(props) {
    super(props)
    this.fetchApi = this.fetchApi.bind(this)
    this.state = {
      isLoaded: false,
      grades: [],
      majors: [],
      topics: [],
      bcs: [],
      dprs: [],
      keyword_majors: [],
      keyword_grades: [],
      bc_topics: [],
      dpr_topics: []

    }
  }

  fetchApi = () => {
    axios.all([
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/grades'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/majors'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/topics'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/bcs?populate=image'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/dprs?populate=image'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/keyword-majors'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/keyword-grades'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/bc-topics'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/dpr-topics'),
    ]).then(axios.spread((...responses) => {
      this.setState({
        isLoaded: true,
        grades: responses[0].data.data,
        majors: responses[1].data.data,
        topics: responses[2].data.data,
        bcs: responses[3].data.data,
        dprs: responses[4].data.data,
        keyword_majors: responses[5].data.data,
        keyword_grades: responses[6].data.data,
        bc_topics: responses[7].data.data,
        dpr_topics: responses[8].data.data,
      })
    }))
  }

  componentDidMount() {
   this.fetchApi()
  }

  
  render() {

    const { isLoaded, grades, majors, topics, bcs, dprs, keyword_majors, keyword_grades, bc_topics, dpr_topics} = this.state
    
    if(!isLoaded) {
      return <div>Loading...</div>
    } else {

      const bcdpr = [...bc_topics, ...dpr_topics]
      const random = bcdpr[Math.floor(Math.random() * bcdpr.length)]

      const filter = random.attributes.hasOwnProperty('bc_id') ? bcs.filter((bc) => bc.id === random.attributes.bc_id) : dprs.filter((dpr) => dpr.id === random.attributes.dpr_id)
      const fixed = filter.length > 0 ? filter[0] : null
      const category = topics.filter((topic) => topic.id == random.attributes.topic_id)
      let badword = ['kasar','kotor','jelek','jorok']
      
      return (
        <ThemeProvider theme={theme}>
          <ChatBot 
          headerTitle="Mejakita Bot"
          bubbleOptionStyle={{ fontFamily: 'Poppins', 
                               fontSize: '12px', 
                               marginLeft: '50px', 
                               width: '185px', 
                               paddingLeft: '20px', 
                               paddingRight: '20px', 
                               alignItems: 'center', 
                               borderRadius: '15px',
                               backgroundColor: '#43A3D3',
                               cursor: 'pointer'
                            }}
          inputStyle={{
            borderRadius: '20px',
            backgroundColor: '#fff',
            paddingLeft: '20px'
          }}
          botAvatar={logo}
          userAvatar={user}
          placeholder="Tulis pesan disini..."
          enableSmoothScroll={true}
          enableMobileAutoFocus={true}
          
          // floating={true}
          
  
          steps={[
            {
              id: '1',
              message: "Hai, aku MejaKitabot!",
              trigger: '2',
            },
            {
              id: '2',
              message: "Bolehkah MejaKitabot tahu apa yang ingin kamu lakukan?",
              trigger: '3',
            },
            {
              id: '3',
              options: [
                {
                  value: 'lihat',
                  label: 'Lihat materi pilihan',
                  trigger: 'level1'
                },
                {
                  value: 'cari',
                  label: 'Cari materi',
                  trigger: 'search_option'
                },
                {
                  value: 'random',
                  label: fixed ? fixed.attributes.name : '',
                  trigger: 'random_topic'
                },
              ]
            },
            {
              id: 'random_topic',
              component: <RandomTopic item={{ 
                              name: fixed.attributes.name, 
                              image: process.env.REACT_APP_SECRET_CODE + fixed.attributes.image.data.attributes.url, 
                              link: fixed.attributes.link, 
                              category: category ? (category.length > 0 ? category[0].attributes.name : null) : null 
                            }} />,
              waitAction: true,
              // asMessage: true,
              trigger: 'rewind'
            },
            {
              id: 'level1',
              message: "Sebelum mancari materi, bolehkah Mejakitabot tahu berada di jenjang manakah kamu?",
              trigger: 'level',
            },
            {
              id: 're_search',
              message: "Ingin mencari materi lain?",
              trigger: 're_search_option'
            },
            {
              id: 're_search_option',
              options: [
                {
                  value: 'yes',
                  label: 'Iya',
                  trigger: 'search_option'
                },
                {
                  value: 'no',
                  label: 'Tidak',
                  trigger: 'rewind'
                },
              ]
            },
            {
              id: 'search_option',
              message: "Silahkan kamu ketik apa yang ingin kamu cari?",
              trigger: 'search',
            },
            {
              id: 'search',
              user: true,
              validator: (value) => {
                if (value == badword.filter(word => value.toLowerCase().includes(word.toLowerCase()))) {
                  return 'Kata tidak pantas terdeteksi';             
                } else {
                  return true
                }
              },
              trigger: 'search_data'
            },
            {
              id: 'search_data',
              component: <Search 
                            bcs={this.state.bcs} 
                            dprs={this.state.dprs} 
                            bc_topics={this.state.bc_topics}
                            dpr_topics={this.state.dpr_topics}
                            topics={this.state.topics} 
                            keyword_grades={this.state.keyword_grades}
                            keyword_majors={this.state.keyword_majors}
                        />,
              waitAction: true,
              // asMessage: true,
            },
            {
              id: 'search_level',
              options: grades.map((level) => ({ label: level.attributes.short, value: level.id, trigger: 'multi_search' })),
            },
            {
              id: 'search_subject',
              options: majors.map((subject) => ({ label: subject.attributes.short, value: subject.id, trigger: 'multi_search' })),
            },
            {
              id: 'level',
              options: grades.map((level) => ({ label: level.attributes.short, value: level.id, trigger: 'subject1' })),
            },
            {
              id: 'subject1',
              message: "Berikut beberapa mapel yang Mejakitabot punya",
              trigger: 'subject',
            },
            {
              id: 'subject',
              options: majors.map((subject) => ({ label: subject.attributes.short, value: subject.id, trigger: 'results' })),
            },
            {
              id: 'multi_search',
              component: <MultiSearch 
                            bcs={this.state.bcs} 
                            dprs={this.state.dprs} 
                            bc_topics={this.state.bc_topics}
                            dpr_topics={this.state.dpr_topics}
                            topics={this.state.topics} 
                            keyword_grades={this.state.keyword_grades}
                            keyword_majors={this.state.keyword_majors}
                        />,
              waitAction: true,
              // asMessage: true,
              trigger: 'rewind'
            },
            {
              id: 'results',
              component: <Results 
                            bcs={this.state.bcs} 
                            dprs={this.state.dprs} 
                            bc_topics={this.state.bc_topics}
                            dpr_topics={this.state.dpr_topics}
                            topics={this.state.topics} 
                        />,
              waitAction: true,
              // asMessage: true,
              trigger: 'rewind'
            },
            {
              id: 'rewind',
              message: 'Apa kamu masih ingin melakukan hal lain?',
              trigger: 'rewind_option'
            },
            {
              id: 'rewind_option',
              options: [
                {
                  value: 'yes',
                  label: 'Iya',
                  trigger: '2'
                },
                {
                  value: 'no',
                  label: 'Tidak, terima kasih',
                  trigger: 'end'
                },
              ]
            },
            {
              id: 'end',
              message: 'Terima kasih telah menggunakan layanan dari Mejakitabot.',
              end: true
            },
          ]} />
        </ThemeProvider>
      )
    }
  }
}

export default App;