import React from 'react'
import HomeImg from '../../images/homeImage.png'
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className='container'>
        <img src={HomeImg} alt='homeimage' height='700px' />
        <br />
        <a href='/fms' className={"btn" + " " + styles.buttonBgColor}>Start <i class="bi bi-arrow-right-circle"></i></a>
    </div>
  )
}
