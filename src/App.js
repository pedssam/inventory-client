import React, { Fragment, Suspense } from 'react'
import { Provider } from 'react-redux'
import store from './store'

// entry points
import Auth from './views/auth'
import NonAuth from './views/non-auth'

const App = () => {
    return (
        <Provider store={ store } >
            <Fragment>
                <Suspense>
                    {
                        window.localStorage.getItem( 'name' ) !== 'null' && 
                        window.localStorage.getItem( 'name' ) !== null &&
                        <Auth />
                    }
                    {
                        ( window.localStorage.getItem( 'name' ) === 'null' || 
                            window.localStorage.getItem( 'name' ) === null ) &&
                        <NonAuth />
                    }
                    
                </Suspense>
            </Fragment>
        </Provider>
    )

}

export default App
