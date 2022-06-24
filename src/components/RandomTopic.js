import React, { Component } from 'react';
import "../styles/accordion.css";

export default class RandomTopic extends Component {
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
        const { name, image, category, link } = this.props.item;
        return (
            <div style={{ width: '100%' }}>
                <h3>{name}</h3>
                <small style={{ color: 'red' }}>{category}</small>
                <img 
                    src={`/${image}`} 
                    alt='img' 
                    style={{ width: '100%', height: 'auto', borderRadius: "10px" }} 
                />
                <small><a href={link} className='link btn'>Lihat lebih banyak</a></small>
            </div>
        );
    }
}