import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import CurrencyFormat from 'react-currency-format'
import React, { Fragment, useEffect, useState } from 'react'

// component
import Wrapper from '../components/wrapper'

// antd
import { Button, Drawer, Form, Input , notification, Popconfirm } from 'antd'
import { Table } from 'ant-table-extensions'

// config
import { config } from '../../../config'

// icons
import Check from '../../../assets/check.png'
import Close from '../../../assets/close.png'
import Trash from '../../../assets/trash.png'
import Export from '../../../assets/export.png'
import PlusOutlined from '@ant-design/icons/PlusOutlined'
import MinusOutlined from '@ant-design/icons/MinusOutlined'

// lodash
import { isEmpty, isString } from 'lodash'

const Receipt = ({
    // assigned valus
    baseUrl
}) => {

    const replaceChar = ( char ) => {
        let string = !isString( char ) ? char.toString() : char
        if( string ) {
            if( string.includes( '₱' ) || string.includes( ',' ) ) {
                return string.replace(/₱/g, '').replace( /,/g, '' )
            }

            return char
        }

        return 0
    }

    useEffect( () => {
        loadData()
    }, [ ] )

    const [ drawer, setDrawer ] = useState({
        open: false,
        title: ''
    })

    const [ action, setAction ] = useState( { 
        id: 0,
     } )

    const { TextArea } = Input

    const [ loading, setLoading ] = useState( true )

    const columns = [
        {
            title: 'Ref No.',
            dataIndex: 'receipt_ref_num',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.receipt_ref_num, record )  } 
                >
                    { value }
                </div>
            )
        },
        {
            title: 'Customer',
            dataIndex: 'receipt_for',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.receipt_ref_num, record )  } 
                >
                    { value }
                </div>
            )
        },
        {
            title: 'Pcs',
            dataIndex: 'add_or_less_stock',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.receipt_ref_num, record )  } 
                >
                    { value }
                </div>
            )
        },
        {
            title: 'Product Name',
            dataIndex: 'p_name',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.receipt_ref_num, record )  } 
                >
                    { value }
                </div>
            )
        },
        {
            title: 'Price',
            dataIndex: 'selling',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.receipt_ref_num, record )  } 
                >
                    
                    <CurrencyFormat 
                        value={ value }
                        displayType={ 'text' } 
                        thousandSeparator={ true } 
                        prefix={'₱'} 
                    />
                </div>
            )
        },
        {
            title: 'Total',
            dataIndex: 'selling',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.receipt_ref_num, record )  } 
                >
                    <CurrencyFormat 
                        value={ value * record.add_or_less_stock }
                        displayType={ 'text' } 
                        thousandSeparator={ true } 
                        prefix={'₱'} 
                    />
                </div>
            )
        },
        {
            title: 'Purchase Amount',
            dataIndex: 'purchase_amount',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.receipt_ref_num, record )  } 
                >
                    <CurrencyFormat 
                        value={ value }
                        displayType={ 'text' } 
                        thousandSeparator={ true } 
                        prefix={'₱'} 
                    />
                </div>
            )
        },
        {
            title: 'Date',
            dataIndex: 'date_time',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.receipt_ref_num, record )  } 
                >
                    { moment( value ).format( 'YYYY-M-DD' ) }
                </div>
            )
        }
    ]

    const [ dataSource, setDataSource ] = useState( [] )

    const loadData = () => {
        
        setLoading( true )

        axios.get( 
            `${ baseUrl }/load-receipt` 
        ).then( res => {
            setDataSource( res.data )
        }).catch( e => {
            console.log( e )
        }).finally( () => {
            setLoading( false )
        })

    }
    
    const [ dataHistory, setDataHistory ] = useState( {} )

    const renderDrawer = ( title, record = {} ) => {
        form.resetFields()
        if( !isEmpty( record ) ) {
            setAction( { ...action , id: record.id } )
            form.setFieldsValue( record )
            setDataHistory( record )
            setHasErrors( false )
        } 

        setDrawer( { ...drawer, open : true, title  } )
    }

    const [ form ] = Form.useForm()
    const [ hasErrors, setHasErrors ] = useState( true )

    const handleFormChange = () => {
        const hasErrors = form.getFieldsError().some( ( { errors } ) => errors.length )
        setHasErrors( hasErrors )
    }
    
    const onFinish = ( values ) => {
        
        let stock = dataHistory.current_stock 

        if( dataHistory.add_or_less_stock > values.add_or_less_stock ) {
            stock = ( dataHistory.add_or_less_stock - values.add_or_less_stock ) + dataHistory.current_stock 
        } else if( dataHistory.add_or_less_stock < values.add_or_less_stock ) {
            stock = dataHistory.current_stock - ( values.add_or_less_stock - dataHistory.add_or_less_stock ) 
        } 
        
        values.purchase_amount = replaceChar( values.purchase_amount )
        values.stock = stock
        values.pid = dataHistory.p_id

        axios.post( 
            `${ baseUrl }/put-receipt/${ action.id }`,
            { ...values } 
        ).then( res => {
            setDrawer( { ...drawer, open : false  } )
            form.resetFields()
            openNotification(
                `Update Receipt`,
                `Receipt successfully Updated`
            )
            loadData()
        })
    }

    const setStock = ( set ) => {

        let value = parseInt( form.getFieldValue( 'add_or_less_stock' ) )
        
        if( set === 'minus' ) {
            value -= 1
        } else if( set === 'plus' ){
            value += 1
        } else {
            value = set.target.value
        }

        const finalStock = ( value <= 0 ) ? 1 : value

        form.setFieldsValue({
            add_or_less_stock: finalStock
        })
        
        let purchase_amount = parseInt(
            form.getFieldValue( 'selling' )
        ) * finalStock

        
        form.setFieldsValue({
            purchase_amount
        })

        handleFormChange()
    }
    
    const deleteRecord = () => {
        axios.post( 
            `${ baseUrl }/delete-receipt/${ action.id }`,
        ).then( res => {
            openNotification(
                `Record successfully deleted`,
                `Deleted Receipt`
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
                                className='action-btn-half'
                                size='large'
                            >
                                <img src={ Trash } alt='trash' style={{ width: 16 }} />
                                Delete
                            </Button>
                        </Popconfirm>
                        <Button
                            className='action-btn-half'
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
                    <label className='text-muted text-xs pt-2 d-block'>Complete Receipt Details</label>
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
                            initialValue={'N/A'}
                            label='Item'
                            name='p_name'
                        >
                            <Input 
                                disabled={ true }
                                size='large'
                            />
                        </Form.Item> 
                        <Form.Item
                            label='Pcs'
                            name='add_or_less_stock'
                            className='text-center'
                            initialValue={ 1 }
                            rules={ [ 
                                { 
                                    required: true, 
                                    message: 'Number of Pcs is required' 
                                } 
                            ] }
                        >
                            <Input 
                                type='number'
                                className='stock-input text-center'
                                suffix={
                                    <PlusOutlined 
                                        onClick={ 
                                            e => setStock( 'plus' )
                                        }
                                    />
                                }
                                prefix={
                                    <MinusOutlined 
                                        onClick={ 
                                            e => setStock( 'minus' )
                                        }
                                    />
                                }
                                onChange={ 
                                    e => setStock( e )
                                }
                                size='large'
                                placeholder='# of Pcs'
                            />
                        </Form.Item> 
                        <Form.Item
                            label='Purchase Amount'
                            name='purchase_amount'
                            rules={ [ 
                                { 
                                    required: true, 
                                    message: 'Purchase Amount is required' 
                                } 
                            ] }
                        >
                            <CurrencyFormat  
                                size='large'
                                className='ant-input-lg w-100 text-end'
                                placeholder='0.00'
                                prefix={'₱'}
                                thousandSeparator={ true }
                            />
                            
                        </Form.Item>
                        <Form.Item
                            initialValue={'N/A'}
                            label='Receipt For'
                            name='receipt_for'
                            rules={ [ 
                                { 
                                    required: true, 
                                    message: 'Receipt for is required' 
                                } 
                            ] }
                        >
                            <Input 
                                size='large'
                                placeholder='Receipt for..'
                            />
                        </Form.Item> 
                        <Form.Item
                            label='Description'
                            name='description'
                        >
                            <TextArea   
                                rows={ 4 }
                                placeholder='Description...'
                                style={{
                                    border: '1px solid #737373',
                                    borderRadius: 10
                                }}
                            />
                            
                        </Form.Item> 
                    </Form>
                    
                </div>
            </Drawer>

            <Wrapper
                title={ 'Receipt Management' }
                subtitle={ 'Generate Receipt by Batch' }
            >
                <Table
                    className='ant-table-content'
                    loading={ loading }
                    columns={ columns }
                    dataSource={ dataSource }
                    rowKey='id'
                    exportable
                    searchable 
                    exportableProps={ { 
                        fileName: 'Receipt List',
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

export default connect( mapStateToProps )( Receipt )
