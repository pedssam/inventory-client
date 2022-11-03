import axios from 'axios'
import React, { Fragment } from 'react'
import { useNavigate  } from 'react-router-dom'

// antd
import { Button, Form, Input, notification } from 'antd'

// styles
import '../../../scss/global.scss'

// config
import { config } from '../../../config'

// lodash
import { isEmpty } from 'lodash'

const Login = () => {

    const [ form ] = Form.useForm()
    const navigate = useNavigate()

    const onFinish = ( values ) => {
        axios.post( 
            `${ config.baseUrl }/login`, 
            { ...values }
        ).then( res => {
            const result = res.data 
            if( isEmpty( result ) ) {
                notification.error({
                    message: `Login`,
                    description: `User doesn't exist`,
                    placement: 'bottom',
                })
            } else {
                window.localStorage.setItem( 'name', result[ 0 ].name  )
                navigate( '/product' )
                window.location.reload()
            }
        })
    }

    return (
        <Fragment>
           <div className='login-container text-center mt-5 pt-5 '>
                <h3>Login</h3>
                <center>
                    <div 
                        className='text-center justify-content-center mt-5'
                        style={{
                            width: '20%'
                        }}
                    >
                        <Form
                            form={ form }
                            labelCol={ { span: 24 } }
                            autoComplete='off'
                            layout='horizontal'
                            onFinish={ onFinish }
                        >
                            <Form.Item
                                label='Username'
                                name='username'
                                rules={ [ 
                                    { 
                                        required: true, 
                                        message: 'Enter your Username' 
                                    } 
                                ] }
                            >
                                <Input 
                                    size='large'
                                    placeholder='Username...'
                                />
                            </Form.Item> 
                            <Form.Item
                                type='password'
                                label='Password'
                                name='password'
                                rules={ [ 
                                    { 
                                        required: true, 
                                        message: 'Enter your Password' 
                                    } 
                                ] }
                            >
                                <Input 
                                    type='password'
                                    size='large'
                                    placeholder='Password...'
                                />
                            </Form.Item> 
                            <Button
                                size='large'
                                type='primary'
                                onClick={ () => form.submit() }
                            >
                                Login
                            </Button>
                        </Form>
                    </div>
                </center>
           </div>
        </Fragment>
    )
}

export default Login