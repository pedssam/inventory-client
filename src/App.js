import React, { Fragment, Suspense } from 'react'

// entry points
import Auth from './views/auth'

const App = () => {

    return (
      <Fragment>
          <Suspense>
              <Auth />
          </Suspense>
      </Fragment>
    )

}

export default App
