import React, { Component } from 'react';
import { Loading } from 'react-simple-chatbot';
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
// import { keyword_faq } from '../dummy/data.json';
// import { question, question_tag, tag } from '../dummy/data.json';
import "../styles/faqaccordion.css";
import { v4 as uuidv4 } from 'uuid';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import mejakitty_sad from '../styles/mejakitty_sad.PNG'

export default class FAQSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            trigger: false,
            // level: null,
            subject: null,
            result: [],
            results: [],
            topicFound: []
        };

        this.triggerNext = this.triggerNext.bind(this);
    }

    async componentWillMount() {

        const arrayQuestions = [this.props.questions]
        const arrayTags = [this.props.tags]
        const arrayQuestion_tags = [this.props.question_tags]
        const arrayKeyword_faqs = [this.props.keyword_faqs]

        const questions = arrayQuestions[0]
        const tags = arrayTags[0]
        const question_tags = arrayQuestion_tags[0]
        const keyword_faqs = arrayKeyword_faqs[0]
        
        const { steps } = this.props;
        const { faq_search } = steps;
        const values = faq_search.value.trim().toLowerCase().split(/[\s,]+/)

        // let grade = []
        let faq = []

        // keyword_grade.map(child_grade => {
        //     if (search.value.trim().toLowerCase().includes(child_grade.keyword.trim().toLowerCase())) grade = [child_grade]
        // })
        keyword_faqs.map(child_faq => {
            if (faq_search.value.trim().toLowerCase().includes(child_faq.attributes.keyword.trim().toLowerCase())) faq = [child_faq.attributes]
        })

        values.map(value => {
            // keyword_grade.map(child_grade => {
            //     if (child_grade.keyword.trim().toLowerCase() === value) grade = [child_grade]
            // })
            keyword_faqs.map(child_faq => {
                if (child_faq.attributes.keyword.trim().toLowerCase() === value) faq = [child_faq]
            })
        })

        const includes = await Promise.all([
            (await Promise.all(questions.map(child_question => {
                if (child_question.attributes.name.toLocaleLowerCase() == faq_search.value.trim().toLowerCase()) {
                    return { 
                        id: child_question.id, 
                        name: child_question.attributes.name, 
                        image: process.env.REACT_APP_SECRET_CODE + child_question.attributes.image.data.attributes.url,
                        desc: child_question.attributes.desc, 
                        link: child_question.attributes.link 
                    }
                } else {
                    let splitTopic = null

                    const checkType = values.filter(value => value == 'course')
                    if (checkType.length > 0) {
                        return false
                    }

                    values.map(value => {
                        child_question.attributes.name.trim().toLowerCase().split(/[\s,]+/).map(tag_word => {
                            if (!['question'].includes(tag_word) && tag_word == value) {
                                splitTopic = { 
                                    id: child_question.id, 
                                    name: child_question.attributes.name, 
                                    image: process.env.REACT_APP_SECRET_CODE + child_question.attributes.image.data.attributes.url,
                                    desc: child_question.attributes.desc, 
                                    link: child_question.attributes.link 
                                }
                            }
                        })
                    })
                    return splitTopic || false
                }
            }))).filter(questions => questions),
            
            (await Promise.all(tags.map(tag => {
                let results = []
                if (tag.attributes.name.toLowerCase().includes(faq_search.value.toLowerCase()) || faq_search.value.toLowerCase().includes(tag.attributes.name.toLowerCase())) {
                    const questTags = question_tags.filter(question => question.attributes.tag_id == tag.id)

                    questTags.map(questTag => {
                        questions.map(child_question => {
                            if (child_question.id == questTag.id) {
                                results = [
                                    ...results, { 
                                        tag: tag.attributes.name, 
                                        name: child_question.attributes.name, 
                                        image: process.env.REACT_APP_SECRET_CODE + child_question.attributes.image.data.attributes.url,
                                        desc: child_question.attributes.desc, 
                                        link: child_question.attributes.link 
                                }]
                            }
                        })
                    })
                }
                return results.length > 0 ? results : false
            }))).filter(questTags => questTags),
        ])

        const level = faq.length > 0 ? [faq[0]] : []
        const subject = faq.length > 0 ? [faq[0]] : []
        const result = faq.length > 0 ? [faq[0]] : (faq.length > 0 ? [faq[0]] : [])
        const multi = level.length > 0 && subject.length > 0

        const topicFound = await Promise.all([
            includes[0].map(row => {
                const filter = question_tags.filter(question => question.attributes.question_id == row.id)
                const category = filter.length > 0 ? tags.filter((tag) => tag.id == filter[0].attributes.tag_id) : false
                
                return {
                    name: row.name,
                    image: row.image,
                    desc: row.desc,
                    link: row.link,
                    tag: category ? (category.length > 0 ? category[0].attributes.name : null) : null
                }
            }),
            // ...includes[1]
        ])

        if (multi) {
            const results = await Promise.all([
                (await Promise.all(questions.map(row => {
                    try {
                        if (row.attributes.faq_id == level[0].attributes.faq_id && row.attributes.faq_id == subject[0].attributes.faq_id) {
                            const filter = question_tags.filter(question => question.id == row.id)
                            const category = filter.length > 0 ? tags.filter((tag) => tag.id == filter[0].attributes.tag_id) : false
                            
                            return {
                                name: row.attributes.name,
                                image: process.env.REACT_APP_SECRET_CODE + row.attributes.image.data.attributes.url,
                                desc: row.attributes.desc,
                                link: row.attributes.link,
                                tag: category ? (category.length > 0 ? category[0].attributes.name : null) : null
                            }
                        }
                        return false
                    } catch (error) {
                        return false
                    }
                }))).filter(questions => questions),
            ])
            this.setState({ results });
        }
        this.setState({ trigger: 'faq_subject_res', level, subject, topicFound, result, loading: false });

        if (this.state.result.length < 1) {
            this.props.triggerNextStep({ trigger: 'faq_re_search' })
        } else {
            if (multi) {
                this.props.triggerNextStep({ trigger: 'faq_re_search' });
            } else {
                if (topicFound[0].length > 0 || topicFound.length > 2) {
                    this.props.triggerNextStep({ trigger: 'faq_re_search' });
                } else {
                    if (subject.length > 0) {
                        this.props.triggerNextStep({ trigger: 'faq_re_search' })
                    } 
                    // else if (subject.length > 0) {
                    //     this.props.triggerNextStep({ trigger: 'search_level' })
                    // }
                }
            }
        }
    }

    triggerNext() {
        this.setState({ trigger: true }, () => {
            this.props.triggerNextStep();
        });
    }

    render() {
        const { loading, result, results, topicFound } = this.state;
        return (
            <div style={{ width: '100%', background: '#fff', padding: '20px 20px', borderRadius: '10px' }}>
                { loading ? <Loading /> : (topicFound[0].length > 0 ? (
                    <div style={{}}>
                    {topicFound.map((materi, parentI) => {
                        if(parentI == 0 || parentI == 1) {
                      return materi.map((row, i) => {
                          const uuid = uuidv4()
                          return (
                          <div key={i + 1} style={{ paddingTop: 12 }}>
                          <nav className="accordion arrows" style={{}}>
                              <input
                              type="radio"
                              name="accordion"
                              id={`materi-${parentI}-${i + 1}-${uuid}`}
                              />
                              <section className="box">
                              <label
                                  className="box-title"
                                  htmlFor={`materi-${parentI}-${i + 1}-${uuid}`}
                              >
                                  {row.name}
                              </label>
                              <label
                                  className="box-close"
                                  htmlFor="acc-close"
                              ></label>
                              <div className="box-content">
                                  <small>{row.tag}</small>
                                  <img
                                  src={`${row.image}`}
                                  alt="img"
                                  className='img'
                                  />
                                  <p className='text-desc'>
                                    <ReactMarkdown children={row.desc} rehypePlugins={[rehypeRaw]} />
                                  </p>
                                  <small><a href={row.link} target='_blank' className='link btn-a'>Lihat lebih banyak</a></small>
                              </div>
                              </section>
                              <input type="radio" name="accordion" id="acc-close" />
                          </nav>
                          </div>
                          )
                      });
                }})}
                </div>
                ) : (topicFound.length > 2 && topicFound[2].length > 0 ? (
                    topicFound[2].map((row, i) => {
                        const uuid = uuidv4()
                        return (
                        <div key={i + 1} style={{ paddingTop: 12 }}>
                            <nav className="accordion arrows" style={{}}>
                                <input
                                type="radio"
                                name="accordion"    
                                id={`materi-${i + 1}-${uuid}`}
                                />
                                <section className="box">
                                <label
                                    className="box-title"
                                    htmlFor={`materi-${i + 1}-${uuid}`}
                                >
                                    {row.name}
                                </label>
                                <label className="box-close" htmlFor="acc-close"></label>
                                <div className="box-content">
                                    <small>{row.tag}</small>
                                    <img
                                    src={`${row.image}`}
                                    alt="img"
                                    className='img'
                                    />
                                    <p className='text-desc'>
                                        <ReactMarkdown children={row.desc} rehypePlugins={[rehypeRaw]} />
                                    </p>
                                  <small><a href={row.link} target='_blank' className='link btn-a'>Lihat lebih banyak</a></small>
                                </div>
                                </section>
                                <input type="radio" name="accordion" id="acc-close" />
                            </nav>
                        </div>
                     ) })
                ) : (results.length > 0 ?
                    (<div style={{}}>
                        {results.map((materi, parentI) => {
                          return materi.map((row, i) => {
                              const uuid = uuidv4()
                              return (
                              <div key={i + 1} style={{ paddingTop: 12 }}>
                              <nav className="accordion arrows" style={{}}>
                                  <input
                                  type="radio"
                                  name="accordion"
                                  id={`materi-${parentI}-${i + 1}-${uuid}`}
                                  />
                                  <section className="box">
                                  <label
                                      className="box-title"
                                      htmlFor={`materi-${parentI}-${i + 1}-${uuid}`}
                                  >
                                      {row.name}
                                  </label>
                                  <label
                                      className="box-close"
                                      htmlFor="acc-close"
                                  ></label>
                                  <div className="box-content">
                                      <small>{row.tag}</small>
                                      <img
                                      src={`${row.image}`}
                                      alt="img"
                                      className='img'
                                      />
                                      <p className='text-desc'>
                                        <ReactMarkdown children={row.desc} rehypePlugins={[rehypeRaw]} />
                                      </p>
                                      <small><a href={row.link} target='_blank' className='link btn-a'>Lihat lebih banyak</a></small>
                                  </div>
                                  </section>
                                  <input type="radio" name="accordion" id="acc-close" />
                              </nav>
                              </div>
                              )
                          });
                          })}
                    </div>) : (result.length > 0 ? `${result[0].keyword} ditemukan, tambahkan kata kunci lainnya` 
                    : (<div style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ textAlign: 'center', fontWeight: 'normal'}}>Mejakitabot tidak dapat menemukan apa yang kamu cari</p>
                            <img src={mejakitty_sad} style={{ width: 'auto', height: '150px', margin: 'auto', display: 'block' }} />
                        </div>)
                    
                    ))))}
            </div>
        )
    }
}                                                                                                                   