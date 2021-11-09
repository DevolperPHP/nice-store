import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Loading from '../main/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderAll } from '@fortawesome/free-solid-svg-icons';
import '../../style/parts/home.css'
export default function Ranking() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const url = `${process.env.REACT_APP_SERVER_URL}/ranking/user`;
        axios(url)
            .then(res => {
                setUsers(res.data)
                setLoading(false)
            })
            .catch(err => console.log(err))
    }, []);
    if (loading) return (<Loading />)
    return (
        <section className='home-section' style={{ height: '55vh', overflowY: users.length > 3 ? 'scroll' : 'hidden' }}>
            <div className="sections-header">
                <h1>Users Leader Board <span style={{opacity:'.6', fontSize:'14px'}}>(Updated Weekly)</span></h1>
                <FontAwesomeIcon icon={faBorderAll} style={{ marginLeft: '10px' }} />
            </div>
            {users.map(({ name, score, rank }, index) => {
                const postion = index + 1;
                const { title, color } = rank
                return (
                    <div className="rank-user" key={name}>
                        <div style={{ display: 'flex' }}>
                            <p >{postion}- {name} </p>
                            <p style={{ marginLeft: '10px', color: color }}>({title})</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <span>Score</span>
                            <span style={{ marginLeft: '10px', color: color }}>{score}.</span>
                        </div>
                    </div>
                )
            })}
        </section>
    )
}
