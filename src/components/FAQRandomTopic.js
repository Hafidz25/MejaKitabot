import React, { Component } from 'react';
import "../styles/faqaccordion.css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default class FAQRandomTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            trigger: false
        };
    }

    componentDidMount() {
        this.props.triggerNextStep();
    }

    render() {
        const { name, image, desc, category, link } = this.props.item;
        return (
            <div style={{ width: '100%', background: '#fff', padding: '20px 20px', borderRadius: '10px' }}>
                <h3>{name}</h3>
                <small>{category}</small>
                <img 
                    src={`${image}`} 
                    alt='img' 
                    style={{ width: '100%', height: 'auto', borderRadius: "10px", marginTop: '10px'}} 
                />
                <p className='text-desc'>
                    <ReactMarkdown children={desc} rehypePlugins={[rehypeRaw]} />
                </p>
                <small><a href={link} target='_blank' className='link btn'>Lihat lebih banyak</a></small>
            </div>
        );
    }
}