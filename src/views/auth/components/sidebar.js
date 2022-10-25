import React, { useState } from 'react'

// antd
import { Layout , Menu } from 'antd'

// icons
import CategoryIcon from '../../../assets/sidebar/category.png'
import ProductIcon from '../../../assets/sidebar/box.png'
import { useNavigate  } from 'react-router-dom'

const Sidebar = () => {

    const navigate = useNavigate()
    const { Sider } = Layout
    const { Item } = Menu 

    const [ currentUrl, setCurrentUrl ] = useState( window.location.pathname )

    const onClick = ( e ) => {
        setCurrentUrl( e.key )
        navigate( e.key )
    }
    return (
        <Sider
            className='left-sidebar-nav position-fixed h-100'
            breakpoint='lg'
            theme='light'
        >
            <div className='h-100 h-100 d-flex flex-column justify-content-between overflow-hidden-auto'>
                <div className='d-flex flex-column align-items-center py-5'>
                    <div>
                        <span 
                            className='text-uppercase text-white display-3 profile-pic d-flex flex-column align-items-center justify-content-center'
                        >
                            AP
                        </span>
                    </div>
                    <div className='display-4 mt-4 text-lg font-weight-bold'>Hi Arvin!</div>
                </div>
                <Menu
                    onClick={ onClick }
                    defaultSelectedKeys={ currentUrl }
                    selectedKeys={ currentUrl }
                    className='w-100 border-right-0'
                >
                    <Item
                        key={ '0' }
                        eventKey={ '/category' }
                        icon={ 
                            <img 
                                src={ CategoryIcon } 
                                alt='category' 
                                width={ 40 }
                            />
                        }
                    >
                        <span className='text-sm'>Category</span>
                    </Item>
                    <Item
                        key={ '0' }
                        eventKey={ '/product' }
                        icon={ 
                            <img 
                                src={ ProductIcon } 
                                alt='product' 
                                width={ 40 }
                            />
                        }
                    >
                        <span className='text-sm'>Product</span>
                    </Item>
                </Menu>
            </div>
        </Sider>
    )

}

export default Sidebar