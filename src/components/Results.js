import React, { Component } from "react";
import { Loading } from "react-simple-chatbot";
// import { bc, bc_topic, dpr, dpr_topic, topic } from "../dummy/data.json";
import "../styles/accordion.css";
import { v4 as uuidv4 } from 'uuid';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import mejakitty_sad from '../styles/mejakitty_sad.PNG'

export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      trigger: false,
      level: null,
      subject: null,
      results: [],
    };

    this.triggerNext = this.triggerNext.bind(this);
  }

  async componentWillMount() {

    const arrayBcs = [this.props.bcs]
        const arrayBc_topics = [this.props.bc_topics]
        const arrayDprs = [this.props.dprs]
        const arrayDpr_topics = [this.props.dpr_topics]
        const arrayTopics = [this.props.topics]

        const bcs = arrayBcs[0]
        const bc_topics = arrayBc_topics[0]
        const dprs = arrayDprs[0]
        const dpr_topics = arrayDpr_topics[0]
        const topics = arrayTopics[0]

    const { steps } = this.props;
    const { level, subject } = steps;

    const results = await Promise.all([
      (
        await Promise.all(
          bcs.map((row) => {
            try {
              if (
                row.attributes.grade_id == level.value &&
                row.attributes.major_id == subject.value
              ) {
                const filter = bc_topics.filter((bc) => bc.id == row.id);
                const category =
                  filter.length > 0
                    ? topics.filter((topic) => topic.id == filter[0].attributes.topic_id)
                    : false;
                return {
                  name: row.attributes.name,
                  image: process.env.REACT_APP_SECRET_CODE + row.attributes.image.data.attributes.url,
                  link: row.attributes.link,
                  topic: category
                    ? category.length > 0
                      ? category[0].attributes.name
                      : null
                    : null,
                };
              }
              return false;
            } catch (error) {
              return false;
            }
          })
        )
      ).filter((bcs) => bcs),
      (
        await Promise.all(
          dprs.map((row) => {
            try {
              if (
                row.attributes.grade_id == level.value &&
                row.attributes.major_id == subject.value
              ) {
                const filter = dpr_topics.filter((dpr) => dpr.id == row.id);
                const category =
                  filter.length > 0
                    ? topics.filter((topic) => topic.id == filter[0].attributes.topic_id)
                    : false;
                return {
                  name: row.attributes.name,
                  image: process.env.REACT_APP_SECRET_CODE + row.attributes.image.data.attributes.url,
                  link: row.attributes.link,
                  topic: category
                    ? category.length > 0
                      ? category[0].attributes.name
                      : null
                    : null,
                };
              }
              return false;
            } catch (error) {
              return false;
            }
          })
        )
      ).filter((dprs) => dprs),
    ]);
    this.setState({ level, subject, results, loading: false });
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
    const { loading, level, subject, results } = this.state;
    return (
      <div style={{ width: "100%", background: '#fff', padding: '20px 20px', borderRadius: '10px' }}>
        {loading ? (
          <Loading />
        ) : results.length > 0 ? (
          <div style={{flex: 1}}>
            Berikut beberapa materi {subject.message} pada jenjang{" "}
            {level.message} yang Mejakitabot punya
            {results.map((bcdpr, parentI) => {
              return bcdpr.map((row, i) => {
                const uuid = uuidv4()
                return (
                <div key={i + 1} style={{ paddingTop: 12}}>
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
                        <small>{row.topic}</small><br/>
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
          </div>
        ) : (<div style={{ alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ textAlign: 'center', fontWeight: 'normal'}}>Mejakitabot tidak dapat menemukan apa yang kamu cari</p>
                <img src={mejakitty_sad} style={{ width: 'auto', height: '150px', margin: 'auto', display: 'block' }} />
            </div>)}
      </div>
    );
  }
}
