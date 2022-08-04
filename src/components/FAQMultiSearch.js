import React, { Component } from 'react';
import { Loading } from 'react-simple-chatbot';
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
// import { keyword_faq, tag, question, question_tag } from '../dummy/data.json';
import '../styles/faqaccordion.css';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import mejakitty_sad from '../styles/mejakitty_sad.PNG'

export default class FAQMultiSearch extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            trigger: false,
            results: []
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
        const { search_level, faq_search_subject, level, faq_subject, faq_search } = steps;

        // let grade = []
        let faq = []

        // keyword_grade.map(child_grade => {
        //     if (search.value.trim().toLowerCase().includes(child_grade.keyword.trim().toLowerCase())) grade = [child_grade]
        // })
        keyword_faqs.map(child_faq => {
            if (faq_search.value.trim().toLowerCase().includes(child_faq.attributes.keyword.trim().toLowerCase())) faq = [child_faq.attributes]
        })

        faq_search.value.trim().toLowerCase().split(/[\s,]+/).map(value => {
            // keyword_grade.map(child_grade => {
            //     if (child_grade.keyword.trim().toLowerCase() === value) grade = [child_grade]
            // })
            keyword_faqs.map(child_faq => {
                if (child_faq.attributes.keyword.trim().toLowerCase() === value) faq = [child_faq]
            })
        })

        // const levelSearch = grade.length > 0 ? grade[0].grade_id : null
        const subjectSearch = faq.length > 0 ? faq[0].faq_id : null
        const results = await Promise.all([
            (await Promise.all(questions.map(row => {
                try {
                    if (subjectSearch) {
                        if (row.attributes.faq_id == faq_search_subject.value) {
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
                    } else {
                        if (row.attributes.faq_id == subjectSearch) {
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
                    }
                    return false
                } catch (error) {
                    return false
                }
            }))).filter(questions => questions),
        ])
        this.setState({ faq_subject, results, loading: false })
    }

    triggerNext() {
        this.setState({ trigger: true }, () => {
            this.props.triggerNextStep();
        });
    }

    componentDidMount() {
        this.props.triggerNextStep();
    }

    render() {
        const { loading, results } = this.state;
        return (
            <div style={{ width: '100%', background: '#fff', padding: '20px 20px', borderRadius: '10px' }}>
                { loading ? <Loading /> : results.length > 0 ? (
                    <div style={{}}>
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
                  </div>

                ) : (<div style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ textAlign: 'center', fontWeight: 'normal'}}>Mejakitabot tidak dapat menemukan apa yang kamu cari</p>
                        <img src={mejakitty_sad} style={{ width: 'auto', height: '150px', margin: 'auto', display: 'block' }} />
                    </div>)}
            </div>
        );
    }
}