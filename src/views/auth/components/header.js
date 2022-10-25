import React from 'react'

// antd
import { Layout  } from 'antd'

// components
import Logout from './logout'

const Header = () => {

    const { Header } = Layout
    return (
        <Header
            className='header-nav bg-white px-4 px-md-5 shadow-sm fixed-top'
            style={ { zIndex: 1000 } }
        >
            <div className='d-flex justify-content-between h-100'>
                <div className='d-flex align-items-center'>
                    {/* logo */}
                </div>
                <div className='d-flex py-3'>
                    <Logout />
                </div>
            </div>
        </Header>
    )

}

export default Header