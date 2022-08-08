import React, { Component } from 'react';
import { Loading } from 'react-simple-chatbot';
// import { keyword_grade, keyword_major } from '../dummy/data.json';
// import { bc, bc_topic, dpr, dpr_topic, topic } from '../dummy/data.json';
import "../styles/accordion.css";
import { v4 as uuidv4 } from 'uuid';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import mejakitty_sad from '../styles/mejakitty_sad.PNG'

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            trigger: false,
            level: null,
            subject: null,
            result: [],
            results: [],
            topicFound: []
        };

        this.triggerNext = this.triggerNext.bind(this);
    }

    async componentWillMount() {

        const arrayBcs = [this.props.bcs]
        const arrayBc_topics = [this.props.bc_topics]
        const arrayDprs = [this.props.dprs]
        const arrayDpr_topics = [this.props.dpr_topics]
        const arrayTopics = [this.props.topics]
        const arrayKeyword_grades = [this.props.keyword_grades]
        const arrayKeyword_majors = [this.props.keyword_majors]

        const bcs = arrayBcs[0]
        const bc_topics = arrayBc_topics[0]
        const dprs = arrayDprs[0]
        const dpr_topics = arrayDpr_topics[0]
        const topics = arrayTopics[0]
        const keyword_grades = arrayKeyword_grades[0]
        const keyword_majors = arrayKeyword_majors[0]


        const { steps } = this.props;
        const { search } = steps;
        const values = search.value.trim().toLowerCase().split(/[\s,]+/)

        let grade = []
        let major = []

        keyword_grades.map(child_grade => {
            if (search.value.trim().toLowerCase().includes(child_grade.attributes.keyword.trim().toLowerCase())) grade = [child_grade.attributes]
        })
        keyword_majors.map(child_major => {
            if (search.value.trim().toLowerCase().includes(child_major.attributes.keyword.trim().toLowerCase())) major = [child_major.attributes]
        })

        values.map(value => {
            keyword_grades.map(child_grade => {
                if (child_grade.attributes.keyword.trim().toLowerCase() === value) grade = [child_grade.attributes]
            })
            keyword_majors.map(child_major => {
                if (child_major.attributes.keyword.trim().toLowerCase() === value) major = [child_major.attributes]
            })
        })

        const includes = await Promise.all([
            (await Promise.all(bcs.map(child_bc => {
                if (child_bc.attributes.name.toLocaleLowerCase() == search.value.trim().toLowerCase()) {
                    return { 
                        id: child_bc.id, 
                        name: child_bc.attributes.name, 
                        image: process.env.REACT_APP_SECRET_CODE + child_bc.attributes.image.data.attributes.url, 
                        link: child_bc.attributes.link }
                } else {
                    let splitTopic = null

                    const checkType = values.filter(value => value == 'dpr')
                    if (checkType.length > 0) {
                        return false
                    }

                    values.map(value => {
                        child_bc.attributes.name.trim().toLowerCase().split(/[\s,]+/).map(topic_word => {
                            if (!['bc', 'dpr'].includes(topic_word) && topic_word == value) {
                                splitTopic = { 
                                    id: child_bc.id, 
                                    name: child_bc.attributes.name, 
                                    image: process.env.REACT_APP_SECRET_CODE + child_bc.attributes.image.data.attributes.url, 
                                    link: child_bc.attributes.link }
                            }
                        })
                    })
                    return splitTopic || false
                }
            }))).filter(bcs => bcs),
            (await Promise.all(dprs.map(child_dpr => {
                if (child_dpr.attributes.name.toLocaleLowerCase() == search.value.trim().toLowerCase()) {
                    return { 
                        id: child_dpr.id, 
                        name: child_dpr.attributes.name, 
                        image: process.env.REACT_APP_SECRET_CODE + child_dpr.attributes.image.data.attributes.url, 
                        link: child_dpr.attributes.link }
                } else {
                    let splitTopic = null

                    const checkType = values.filter(value => value == 'bc')
                    if (checkType.length > 0) {
                        return false
                    }

                    values.map(value => {
                        child_dpr.attributes.name.trim().toLowerCase().split(/[\s,]+/).map(topic_word => {
                            if (!['bc', 'dpr'].includes(topic_word) && topic_word == value) {
                                splitTopic = { 
                                    id: child_dpr.id, 
                                    name: child_dpr.attributes.name, 
                                    image: process.env.REACT_APP_SECRET_CODE + child_dpr.attributes.image.data.attributes.url, 
                                    link: child_dpr.attributes.link }
                            }
                        })
                    })
                    return splitTopic || false
                }
            }))).filter(dprs => dprs),
            (await Promise.all(topics.map(topic => {
                let results = []
                if (topic.attributes.name.toLowerCase().includes(search.value.toLowerCase()) || search.value.toLowerCase().includes(topic.attributes.name.toLowerCase())) {
                    const dprTopics = dpr_topics.filter(dpr => dpr.attributes.topic_id == topic.id)
                    const bcTopics = bc_topics.filter(bc => bc.attributes.topic_id == topic.id)

                    dprTopics.map(dprTopic => {
                        dprs.map(child_dpr => {
                            if (child_dpr.id == dprTopic.id) {
                                results = [...results, { 
                                    topic: topic.attributes.name, 
                                    name: child_dpr.attributes.name, 
                                    image: process.env.REACT_APP_SECRET_CODE + child_dpr.attributes.image.data.attributes.url, 
                                    link: child_dpr.attributes.link }]
                            }
                        })
                    })

                    bcTopics.map(bcTopic => {
                        bcs.map(child_bc => {
                            if (child_bc.id == bcTopic.id) {
                                results = [...results, { 
                                    topic: topic.attributes.name, 
                                    name: child_bc.attributes.name, 
                                    image: process.env.REACT_APP_SECRET_CODE + child_bc.attributes.image.data.attributes.url, 
                                    link: child_bc.attributes.link }]
                            }
                        })
                    })
                }
                return results.length > 0 ? results : false
            }))).filter(topics => topics),
        ])

        const level = grade.length > 0 ? [grade[0]] : []
        const subject = major.length > 0 ? [major[0]] : []
        const result = grade.length > 0 ? [grade[0]] : (major.length > 0 ? [major[0]] : [])
        const multi = level.length > 0 && subject.length > 0

        const topicFound = await Promise.all([
            includes[0].map(row => {
                const filter = bc_topics.filter(bc => bc.attributes.bc_id == row.id)
                const category = filter.length > 0 ? topics.filter((topic) => topic.id == filter[0].attributes.topic_id) : false
                return {
                    name: row.name,
                    image: row.image,
                    link: row.link,
                    topic: category ? (category.length > 0 ? category[0].attributes.name : null) : null
                }
            }),
            includes[1].map(row => {
                const filter = dpr_topics.filter(dpr => dpr.attributes.dpr_id == row.id)
                const category = filter.length > 0 ? topics.filter((topic) => topic.id == filter[0].attributes.topic_id) : false
                return {
                    name: row.name,
                    image: row.image,
                    link: row.link,
                    topic: category ? (category.length > 0 ? category[0].attributes.name : null) : null
                }
            }),
            ...includes[2]
        ])

        if (multi) {
            const results = await Promise.all([
                (await Promise.all(bcs.map(row => {
                    try {
                        if (row.attributes.grade_id == level[0].attributes.grade_id && row.attributes.major_id == subject[0].attributes.major_id) {
                            const filter = bc_topics.filter(bc => bc.id == row.id)
                            const category = filter.length > 0 ? topics.filter((topic) => topic.id == filter[0].attributes.topic_id) : false
                            return {
                                name: row.name,
                                image: row.image,
                                link: row.link,
                                topic: category ? (category.length > 0 ? category[0].attributes.name : null) : null
                            }
                        }
                        return false
                    } catch (error) {
                        return false
                    }
                }))).filter(bcs => bcs),
                (await Promise.all(dprs.map(row => {
                    try {
                        if (row.attributes.grade_id == level[0].attributes.grade_id && row.attributes.major_id == subject[0].attributes.major_id) {
                            const filter = dpr_topics.filter(dpr => dpr.id == row.id)
                            const category = filter.length > 0 ? topics.filter((topic) => topic.id == filter[0].attributes.topic_id) : false
                            return {
                                name: row.name,
                                image: row.image,
                                link: row.link,
                                topic: category ? (category.length > 0 ? category[0].attributes.name : null) : null
                            }
                        }
                        return false
                    } catch (error) {
                        return false
                    }
                }))).filter(dprs => dprs),
            ])
            this.setState({ results });
        }
        this.setState({ trigger: 'subject_res', level, subject, topicFound, result, loading: false });

        if (this.state.result.length < 1) {
            this.props.triggerNextStep({ trigger: 're_search' })
        } else {
            if (multi) {
                this.props.triggerNextStep({ trigger: 're_search' });
            } else {
                if (topicFound[0].length > 0 || topicFound[1].length > 0 || topicFound.length > 2) {
                    this.props.triggerNextStep({ trigger: 're_search' });
                } else {
                    if (level.length > 0) {
                        this.props.triggerNextStep({ trigger: 'search_subject' })
                    } else if (subject.length > 0) {
                        this.props.triggerNextStep({ trigger: 'search_level' })
                    }
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
                { loading ? <Loading /> : (topicFound[0].length > 0 || topicFound[1].length > 0 ? (
                    <div style={{}}>
                    {topicFound.map((bcdpr, parentI) => {
                        if(parentI == 0 || parentI == 1) {
                      return bcdpr.map((row, i) => {
                          const uuid = uuidv4()
                          return (
                          <div key={i + 1} style={{ paddingTop: 12 }}>
                          <nav className="accordion arrows" style={{}}>
                              <input
                              type="radio"
                              name="accordion"
                              id={`bcdpr-${parentI}-${i + 1}-${uuid}`}
                              />
                              <section className="box">
                              <label
                                  className="box-title"
                                  htmlFor={`bcdpr-${parentI}-${i + 1}-${uuid}`}
                              >
                                  {row.name}
                              </label>
                              <label
                                  className="box-close"
                                  htmlFor="acc-close"
                              ></label>
                              <div className="box-content">
                                  <small>{row.topic}</small>
                                  <img
                                  src={`${row.image}`}
                                  alt="img"
                                  style={{ width: "100%", height: "100%", borderRadius: "10px" }}
                                  />
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
                                id={`bcdpr-${i + 1}-${uuid}`}
                                />
                                <section className="box">
                                <label
                                    className="box-title"
                                    htmlFor={`bcdpr-${i + 1}-${uuid}`}
                                >
                                    {row.name}
                                </label>
                                <label className="box-close" htmlFor="acc-close"></label>
                                <div className="box-content">
                                    <small>{row.topic}</small>
                                    <img
                                    src={`${row.image}`}
                                    alt="img"
                                    style={{ width: "100%", height: "100%", borderRadius: "10px" }}
                                    />
                                  <small><a href={row.link} target='_blank' className='link btn-a'>Lihat lebih banyak</a></small>
                                </div>
                                </section>
                                <input type="radio" name="accordion" id="acc-close" />
                            </nav>
                        </div>
                     ) })
                ) : (results.length > 0 ?
                    (<div style={{}}>
                        {results.map((bcdpr, parentI) => {
                          return bcdpr.map((row, i) => {
                              const uuid = uuidv4()
                              return (
                              <div key={i + 1} style={{ paddingTop: 12 }}>
                              <nav className="accordion arrows" style={{}}>
                                  <input
                                  type="radio"
                                  name="accordion"
                                  id={`bcdpr-${parentI}-${i + 1}-${uuid}`}
                                  />
                                  <section className="box">
                                  <label
                                      className="box-title"
                                      htmlFor={`bcdpr-${parentI}-${i + 1}-${uuid}`}
                                  >
                                      {row.name}
                                  </label>
                                  <label
                                      className="box-close"
                                      htmlFor="acc-close"
                                  ></label>
                                  <div className="box-content">
                                      <small>{row.topic}</small>
                                      <img
                                      src={`${row.image}`}
                                      alt="img"
                                      style={{ width: "100%", height: "100%", borderRadius: "10px" }}
                                      />
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