import React, { Fragment, Suspense } from 'react'
import { Provider } from 'react-redux'
import store from './store'

// entry points
import Auth from './views/auth'

const App = () => {

    return (
        <Provider store={ store } >
            <Fragment>
                <Suspense>
                    <Auth />
                </Suspense>
            </Fragment>
        </Provider>
    )

}

export default App
