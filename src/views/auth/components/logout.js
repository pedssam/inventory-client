import React from 'react'
import { useNavigate  } from 'react-router-dom'

// icons
import LogoutIcon from '../../../assets/Logout.svg'

const Logout = () => {
    
    const navigate = useNavigate()

    return (
        <div
            className='d-flex align-items-center cursor-pointer'
        >
            <img 
                src={ LogoutIcon } 
                alt='logout'
            />
            <div 
                className='ml-3 d-none d-md-block text-muted'
                onClick={ e=> {
                    window.localStorage.setItem( 'name', null )
                    navigate( 'login' )
                    window.location.reload()
                }}
            >
                Log out
            </div>
        </div>
    )
}

export default Logout