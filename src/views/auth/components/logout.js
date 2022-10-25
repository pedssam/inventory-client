import React from 'react'

// icons
import LogoutIcon from '../../../assets/Logout.svg'

const Logout = () => {
    
    return (
        <div
            className='d-flex align-items-center cursor-pointer'
        >
            <img 
                src={ LogoutIcon } 
                alt='logout'
            />
            <div className='ml-3 d-none d-md-block text-muted'>
                Log out
            </div>
        </div>
    )
}

export default Logout