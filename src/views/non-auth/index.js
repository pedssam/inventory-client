import React, { Fragment } from 'react'
import { Routes, Route } from 'react-router-dom'

// components
import Login from './pages/login'

// styles
import '../../scss/global.scss'

const NonAuth = () => {

    return (
        <Fragment>
            <Routes>
                <Route
                    exact
                    path={ [ '/login', '/' ] }
                    element= { <Login /> }
                />
                
            </Routes>
        </Fragment>
    )
}

export default NonAuth