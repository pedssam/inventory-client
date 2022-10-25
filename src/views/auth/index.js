import React, { Fragment, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// antd
import { Layout } from 'antd'

// components
import Product from './pages/product'
import Category from './pages/category'
import Header from './components/header'
import Sidebar from './components/sidebar'

// styles
import '../../scss/global.scss'

const Auth = () => {

    const { Content } = Layout
    return (
        <Fragment>
            <Layout>
                <Header />
                <Layout>
                    <Sidebar />
                    <Layout>
                        <Content
                            className='auth-layout'
                        >
                            <Suspense>
                                <Routes>
                                    <Route
                                        exact
                                        path='/category'
                                        element= { <Category /> }
                                    />
                                    <Route
                                        exact
                                        path='/product'
                                        element= { <Product /> }
                                    />
                                </Routes>
                            </Suspense>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </Fragment>
    )
}

export default Auth