import axios from 'axios'
import { connect } from 'react-redux'
import React, { Fragment, useEffect, useState } from 'react'

// component
import Wrapper from '../components/wrapper'

// antd
import { Button, Drawer, Form, Input , notification, Popconfirm  } from 'antd'
import { Table } from 'ant-table-extensions'

// config
import { config } from '../../../config'

// icons
import Plus from '../../../assets/plus.png'
import Check from '../../../assets/check.png'
import Trash from '../../../assets/trash.png'
import Close from '../../../assets/close.png'
import Export from '../../../assets/export.png'

// lodash
import { isEmpty } from 'lodash'

const Category = ({
    // assigned valus
    baseUrl
}) => {

    useEffect( () => {
        loadData()
    }, [ ] )

    const [ drawer, setDrawer ] = useState({
        open: false,
        title: ''
    })

    const [ action, setAction ] = useState( { 
        id: 0,
        mode: ''
     } )


    const [ loading, setLoading ] = useState( true )
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.name, record )  } 
                >
                    { value }
                </div>
            )
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.name, record )  } 
                >
                    { value }
                </div>
            )
        },
        {
            title: 'Code',
            dataIndex: 'code',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.name, record )  } 
                >
                    { value }
                </div>
            )
        },
    ]

    const [ dataSource, setDataSource ] = useState( [] )

    const loadData = () => {
        
        setLoading( true )

        axios.get( 
            `${ baseUrl }/get-category` 
        ).then( res => {
            setDataSource( res.data )
        }).catch( e => {
            console.log( e )
        }).finally( () => {
            setLoading( false )
        })

    }
    
    const renderDrawer = ( title, record = {} ) => {
        form.resetFields()
        if( !isEmpty( record ) ) {
            setAction( { ...action , id: record.id, mode: 'put' } )
            form.setFieldsValue( record )
            setHasErrors( false )
        } else {
            setAction( { ...action , mode: 'add' } )
            setHasErrors( true )
        }

        setDrawer( { ...drawer, open : true, title  } )
    }

    const [ form ] = Form.useForm()
    const [ hasErrors, setHasErrors ] = useState( true )

    const handleFormChange = () => {
        if( action.mode === 'add' ) {
            const hasErrors = !form.isFieldsTouched(true) || form.getFieldsError().some( ( { errors } ) => errors.length )
            setHasErrors( hasErrors )
        } else {
            const hasErrors = form.getFieldsError().some( ( { errors } ) => errors.length )
            setHasErrors( hasErrors )
        }
    }
    
    const onFinish = ( values ) => {
        
        let url = `${ baseUrl }/add-category`
        if( action.mode === 'put' ) {
            url = `${ baseUrl }/put-category/${ action.id }`
        }

        axios.post( 
            url,
            { ...values } 
        ).then( res => {
            openNotification(
                `${ action.mode === 'put' ? 'Update' : 'Creation of' } Category `,
                `Category successfully ${ action.mode === 'put' ? 'changed' : 'added' }`
            )
            
            if( action.mode === 'add' ) {
                form.resetFields()
                setHasErrors( true )
            }

            loadData()
        })
    }

    const deleteRecord = () => {
        axios.post( 
            `${ baseUrl }/delete-category/${ action.id }`,
        ).then( res => {
            openNotification(
                `Record successfully deleted`,
                `Deleted Category`
            )
            
            setDrawer( { ...drawer, open : false  } )
            loadData()
        })
    }

    const openNotification = ( message, description, placement = 'bottom' ) => {
        notification.success({
          message,
          description,
          placement,
        })
    }

    return (
        <Fragment>

            <Drawer 
                getContainer={ false }
                closable={ false }
                onClose={ e => setDrawer( { ...drawer, open : false } ) }
                open={ drawer.open }
                placement='right'
                footer={
                    <>
                        <Popconfirm 
                            placement='top' title={ 'Are you sure you want to delete?' } 
                            onConfirm={ deleteRecord } 
                            okText='Yes' 
                            cancelText='Cancel'
                        >
                            <Button
                                type='default'
                                className={ `action-btn-${ action.mode === 'put' ? 'half' : ' d-none' }` }
                                size='large'
                            >
                                <img src={ Trash } alt='trash' style={{ width: 16 }} />
                                Delete
                            </Button>
                        </Popconfirm>
                        <Button
                            className={ `action-btn-${ action.mode === 'put' ? 'half' : 'full' }` }
                            type='primary'
                            size='large'
                            disabled= { hasErrors }
                            onClick={ () => form.submit() }
                        >
                            <img src={ Check } alt='check' />
                            Save Now
                        </Button>
                    </>
                }
            >
                <div className='title mt-2'>
                    <span className='text-lg w-100'>
                        { drawer.title }
                        <img 
                            onClick={ e => setDrawer( { ...drawer, open : false } ) }
                            className='cursor-pointer pull-right'
                            src={ Close } 
                            style={{
                                marginRight: 5,
                            }}
                            alt='close'
                        />
                    </span>
                    <label className='text-muted text-xs pt-2 d-block'>Complete Category Details</label>
                </div>
                <div className='drawer-body pt-4'>
                    <Form
                        form={ form }
                        labelCol={ { span: 24 } }
                        autoComplete='off'
                        layout='horizontal'
                        onFinish={ onFinish }
                        onFieldsChange={ handleFormChange }
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={ [ 
                                { 
                                    required: true, 
                                    message: 'Category Name is required' 
                                } 
                            ] }
                        >
                            <Input 
                                size='large'
                                placeholder='Name of Category'
                            />
                        </Form.Item> 
                        <Form.Item
                            label="Code"
                            name="code"
                            rules={ [ 
                                { 
                                    required: true, 
                                    message: 'Category Code is required' 
                                } 
                            ] }
                        >
                            <Input 
                                size='large'
                                placeholder='Category Code'
                            />
                        </Form.Item> 
                        <Form.Item
                            label="Supplier"
                            name="supplier"
                            rules={ [ 
                                { 
                                    required: true, 
                                    message: 'Supplier is required' 
                                } 
                            ] }
                        >
                            <Input 
                                size='large'
                                placeholder='Supplier Name'
                            />
                        </Form.Item> 
                    </Form>
                    
                </div>
            </Drawer>

            <Wrapper
                title={ 'Category' }
                subtitle={ 'Manage list of Category' }
            >
                <Button
                    onClick = { e => { renderDrawer( 'Add new Category' ) } }
                >
                    <img src={ Plus } alt = 'plus' />
                    Add Item
                </Button>
                <Table
                    className='ant-table-content'
                    loading={ loading }
                    columns={ columns }
                    dataSource={ dataSource }
                    rowKey='id'
                    exportable
                    searchable 
                    exportableProps={ { 
                        fileName: 'Category List',
                        btnProps: {
                            className: 'export-btn',
                            icon: <img src={ Export } alt = 'export' />,
                        }
                    } }
                    pagination={ {
                        pageSize: 10,
                    } }
                />
            </Wrapper>
        </Fragment>
    )
}

let mapStateToProps = () => {

    const { baseUrl } = config
    return {
        baseUrl
    }
}

export default connect( mapStateToProps )( Category )
