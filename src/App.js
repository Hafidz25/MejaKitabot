import React, { Component } from 'react';
import './index.css'
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import Results from './components/Results';
import Search from './components/Search';
import MultiSearch from './components/MultiSearch';
import RandomTopic from './components/RandomTopic';
import FAQResults from './components/FAQResults';
import FAQSearch from './components/FAQSearch';
import FAQMultiSearch from './components/FAQMultiSearch';
import FAQRandomTopic from './components/FAQRandomTopic';
// import { major, grade, bc, bc_topic, dpr, dpr_topic, topic } from './dummy/data.json';
import logo from './styles/logo.png'
import user from './styles/user.png'
import mejakitty_hello from './styles/mejakitty_hello.PNG' 
import mejakitty_think from './styles/mejakitty_think.png' 
 
import axios from 'axios'
import { Player, Controls } from '@lottiefiles/react-lottie-player';


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
      dpr_topics: [],

      faqs: [],
      questions: [],
      question_tags: [],
      tags: [],
      keyword_faqs: []
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

      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/faqs'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/questions?populate=image'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/question-tags'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/tags'),
      axios.get( process.env.REACT_APP_SECRET_CODE + '/api/keyword-faqs')
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

        faqs: responses[9].data.data,
        questions: responses[10].data.data,
        question_tags: responses[11].data.data,
        tags: responses[12].data.data,
        keyword_faqs: responses[13].data.data
      })
    }))
  }

  componentDidMount() {
   this.fetchApi()
  }

  
  render() {

    const { isLoaded, grades, majors, topics, bcs, dprs, keyword_majors, keyword_grades, bc_topics, dpr_topics, 
            faqs, questions, question_tags, tags, keyword_faqs } = this.state
    
    if(!isLoaded) {
      return <div style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Player
                  autoplay
                  loop
                  src="https://assets7.lottiefiles.com/packages/lf20_yQz03Y.json"
                  style={{ height: '500px', width: 'auto' }}
                  >
              </Player>
            </div>
    } else {

      const bcdpr = [...bc_topics, ...dpr_topics]
      const random = bcdpr[Math.floor(Math.random() * bcdpr.length)]

      const filter = random.attributes.hasOwnProperty('bc_id') ? bcs.filter((bc) => bc.id === random.attributes.bc_id) : dprs.filter((dpr) => dpr.id === random.attributes.dpr_id)
      const fixed = filter.length > 0 ? filter[0] : null
      const category = topics.filter((topic) => topic.id == random.attributes.topic_id)
      let badword = ['kasar','kotor','jelek','jorok']

      const quest = [...question_tags]
      const faqrandom = quest[Math.floor(Math.random() * quest.length)]
      const faqfilter = faqrandom.attributes.hasOwnProperty('question_id') ? questions.filter((question) => question.id === faqrandom.attributes.question_id) : questions.filter((question) => question.id === faqrandom.attributes.question_id)
      const faqfixed = faqfilter.length > 0 ? faqfilter[0] : null
      const faqcategory = tags.filter((tag) => tag.id == faqrandom.attributes.tag_id)

      var faqtext = faqfixed.attributes.name.slice(0, 40) + (faqfixed.attributes.name.length > 40 ? '...' : '')
      
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
          customStyle={{
            background: '#ECEFF1',
            boxShadow: 'none'
          }}
          floating={true}
          
  
          steps={[
            {
              id: '1',
              message: "Hai, aku MejaKitabot!",
              trigger: '1a',
            },
            {
              id: '1a',
              component:  <img src={mejakitty_hello} style={{ width: 'auto', height: '150px' }} />,
              trigger: '2',
            },
            {
              id: '2',
              message: "Berikut menu yang tersedia di Mejakitabot",
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
                {
                  value: 'faq',
                  label: 'FAQ',
                  trigger: 'faq1'
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
                {
                  value: 'random',
                  label: fixed ? fixed.attributes.name : '',
                  trigger: 'random_topic'
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
              id: 'faq1',
              message: "Hai, Selamat datang di menu FAQ",
              trigger: 'faq1a',
            },
            {
              id: 'faq1a',
              component:  <img src={mejakitty_think} style={{ width: 'auto', height: '150px' }} />,
              trigger: 'faq2',
            },
            {
              id: 'faq2',
              message: "Berikut informasi tentang pertanyaan yang sering diajukan oleh pengguna",
              trigger: 'faq3',
            },
            {
              id: 'faq3',
              options: [
                {
                  value: 'lihat',
                  label: 'Lihat pertanyaan pilihan',
                  trigger: 'faq_level1',
                },
                {
                  value: 'cari',
                  label: 'Cari pertanyaan',
                  trigger: 'faq_search_option'
                },
                {
                  value: 'random',
                  label: faqfixed ? faqtext : '',
                  trigger: 'faq_random_topic'
                },
                {
                  value: 'kembali',
                  label: 'Kembali ke menu',
                  trigger: '2'
                }
              ]
            },
            {
              id: 'faq_random_topic',
              component: <FAQRandomTopic item={{ 
                                          name: faqfixed.attributes.name, 
                                          image: process.env.REACT_APP_SECRET_CODE + faqfixed.attributes.image.data.attributes.url, 
                                          desc: faqfixed.attributes.desc, 
                                          link: faqfixed.attributes.link, 
                                          category: faqcategory ? (faqcategory.length > 0 ? faqcategory[0].attributes.name : null) : null 
                                  }} />,
              waitAction: true,
              // asMessage: true,
              trigger: 'faq_rewind'
            },
            {
              id: 'faq_re_search',
              message: "Ingin mencari pertanyaan lain?",
              trigger: 'faq_re_search_option'
            },
            {
              id: 'faq_re_search_option',
              options: [
                {
                  value: 'yes',
                  label: 'Iya',
                  trigger: 'faq_search_option'
                },
                {
                  value: 'no',
                  label: 'Tidak',
                  trigger: 'faq_rewind'
                },
              ]
            },
            {
              id: 'faq_search_option',
              message: "Silahkan kamu ketik apa yang ingin kamu cari?",
              trigger: 'faq_search',
            },
            {
              id: 'faq_search',
              user: true,
              validator: (value) => {
                if (value == badword.filter(word => value.toLowerCase().includes(word.toLowerCase()))) {
                  return 'Kata tidak pantas terdeteksi';             
                } else {
                  return true
                }
              },
              trigger: 'faq_search_data'
            },
            {
              id: 'faq_search_data',
              component: <FAQSearch 
                            questions={this.state.questions} 
                            tags={this.state.tags}
                            question_tags={this.state.question_tags}
                            keyword_faqs={this.state.keyword_faqs}
                          />,
              waitAction: true,
              // asMessage: true,
            },
            
            {
              id: 'faq_search_subject',
              options: faqs.map((subject) => ({ label: subject.attributes.short, value: subject.id, trigger: 'faq_multi_search' })),
            },
            
            {
              id: 'faq_level1',
              message: "Berikut beberapa kategori FAQ yang Mejakitabot punya",
              trigger: 'faq_subject',
            },
            {
              id: 'faq_subject',
              options: faqs.map((subject) => ({ label: subject.attributes.short, value: subject.id, trigger: 'faq_results' })),
            },
            {
              id: 'faq_multi_search',
              component: <FAQMultiSearch 
                            questions={this.state.questions} 
                            tags={this.state.tags}
                            question_tags={this.state.question_tags}
                            keyword_faqs={this.state.keyword_faqs}
                          />,
              waitAction: true,
              // asMessage: true,
              trigger: 'faq_rewind'
            },
            {
              id: 'faq_results',
              component: <FAQResults
                            questions={this.state.questions} 
                            tags={this.state.tags}
                            question_tags={this.state.question_tags}
                        />,
              waitAction: true,
              // asMessage: true,
              trigger: 'faq_rewind'
            },
            {
              id: 'faq_rewind',
              message: 'Apa kamu masih ingin melakukan hal lain di menu FAQ ini?',
              trigger: 'faq_rewind_option'
            },
            {
              id: 'faq_rewind_option',
              options: [
                {
                  value: 'yes',
                  label: 'Iya',
                  trigger: 'faq2'
                },
                {
                  value: 'no',
                  label: 'Kembali ke menu',
                  trigger: 'faq_end'
                },
              ]
            },
            {
              id: 'faq_end',
              message: 'Terima kasih telah menggunakan layanan FAQ dari Mejakitabot.',
              trigger: '2'
            },

            {
              id: 'end',
              message: 'Terima kasih telah menggunakan layanan dari Mejakitabot.',
              trigger: 'end1'
            },
            {
              id: 'end1',
              component:  <img src={mejakitty_hello} style={{ width: 'auto', height: '150px' }} />,
              end: true
            },
          ]} />
        </ThemeProvider>
      )
    }
  }
}

export default App;