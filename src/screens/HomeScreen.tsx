import React from 'react'
import Header from '../components/Header'
import Background from '../components/Background'
import Footer from '../components/Footer'
import Recents from '../components/Recents'
import SurahList from '../components/SurahsList'

export default function HomeScreen() {
  return (
    <>
    <Background />
    <Header />
    <Recents />
    <SurahList />
    <Footer />
    </>
  )
}
