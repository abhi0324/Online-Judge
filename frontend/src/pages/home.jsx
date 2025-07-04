import React from 'react';
import {Link} from 'react-router-dom';

function Home(){
    return (
        <div className='container'>
            <h1>Online Judge</h1>
            <p>Welcome to Online Judge platform where you can practice problems, write code, and submit solutions in real time</p>
            <div style={{marginTop: '2rem'}}>
                <Link to='/login'>
                    <button style={{marginRight: '2rem'}}>Login</button>
                </Link>
                <Link to='/register'>
                    <button>Register</button>
                </Link>
            </div>
        </div>
    )
}

export default Home;