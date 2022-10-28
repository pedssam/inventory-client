import axios from 'axios'
import { connect } from 'react-redux'
import CurrencyFormat from 'react-currency-format'
import React, { Fragment, useEffect, useState } from 'react'

// component
import Wrapper from '../components/wrapper'

// antd
import { Button, Drawer, Form, Input , notification, Popconfirm, Select } from 'antd'
import { Table } from 'ant-table-extensions'

// config
import { config } from '../../../config'

// icons
import Plus from '../../../assets/plus.png'
import Check from '../../../assets/check.png'
import Trash from '../../../assets/trash.png'
import Close from '../../../assets/close.png'
import Export from '../../../assets/export.png'
import PlusOutlined from '@ant-design/icons/PlusOutlined'
import MinusOutlined from '@ant-design/icons/MinusOutlined'
// lodash
import { isEmpty, isInteger } from 'lodash'

const Product = ({
    // assigned valus
    baseUrl
}) => {

    const replaceChar = ( char ) => {
        let string = isInteger( char ) ? char.toString() : char
        if( string ) {
            if( string.includes( '₱' ) || string.includes( ',' ) ) {
                return string.replace(/₱/g, '').replace( /,/g, '' )
            }

            return char
        }

        return 0
    }

    const { TextArea } = Input

    useEffect( () => {
        loadCategory()
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


     const [ total, setTotal ] = useState({
        total_investment: 0,
        exp_return: 0
    })

    const [ form ] = Form.useForm()
    const [ category, setCategory ] = useState( [] )
    const [ loading, setLoading ] = useState( true )
    const [ hasErrors, setHasErrors ] = useState( true )
    const [ dataSource, setDataSource ] = useState( [] )
    const [ withReceipt, setWithReceipt ] = useState( false )
    const [ realRecord, setRealRecord ] = useState( {} )
    const [ stockHistory, setStockHistory ] = useState({
        stock_history: 0,
    })

    const columns = [
        {
            title: 'Pcs',
            dataIndex: 'stock',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.name, record )  } 
                >
                    { value }
                </div>
            )
        },
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
            title: 'Category',
            dataIndex: 'code',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.name, record )  } 
                >
                    { value }
                </div>
            )
        },
        {
            title: 'Investment',
            dataIndex: 'investment',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.name, record )  } 
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
            title: 'Total Investment',
            dataIndex: 'total_investment',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.name, record )  } 
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
            title: 'Selling Price',
            dataIndex: 'selling',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.name, record )  } 
                >
                    <CurrencyFormat 
                        value={ value } 
                        displayType={ 'text' } 
                        thousandSeparator={ true } 
                        fixedDecimalScale={ true }
                        prefix={'₱'} 
                    />
                </div>
            )
        },
        {
            title: 'Expected Return',
            dataIndex: 'exp_return',
            render: ( value , record ) => (
                <div 
                    onDoubleClick={ e => renderDrawer ( record.name, record )  } 
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
    ]

    const loadCategory = () => {

        axios.get( 
            `${ baseUrl }/get-category` 
        ).then( res => {
            setCategory( res.data )
        })

    }

    const loadData = () => {
        
        setLoading( true )

        axios.get( 
            `${ baseUrl }/get-product` 
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
        setTotal({
            total_investment: 0,
            exp_return: 0
        })
        if( !isEmpty( record ) ) {
            setAction( { ...action , id: record.id, mode: 'put' } )
            form.setFieldsValue( record )
            setWithReceipt( false )
            setRealRecord( record )
            setHasErrors( false )
            setStockHistory( { ...stockHistory, stock_history: form.getFieldValue( 'stock' ) } )

        } else {
            setAction( { ...action , mode: 'add' } )
            setHasErrors( true )
        }

        setDrawer( { ...drawer, open : true, title  } )
    }

    const handleFormChange = () => {
        if( action.mode === 'add' ) {
            const hasErrors = !form.isFieldsTouched(true) || form.getFieldsError().some( ( { errors } ) => errors.length )
            setHasErrors( hasErrors )
        } else {
            const hasErrors =  form.getFieldsError().some( ( { errors } ) => errors.length )
            setHasErrors( hasErrors )
        }
    }

    const setStock = ( set ) => {

        let value = parseInt( form.getFieldValue( 'stock' ) )
        
        if( set === 'minus' ) {
            value -= 1
        } else if( set === 'plus' ){
            value += 1
        } else {
            value = set.target.value
        }

        const finalStock = ( value <= 0 ) ? 1 : value
        form.setFieldsValue({
            stock: finalStock
        })
        
        let inv = parseInt(
            replaceChar( form.getFieldValue( 'investment' ) ) 
        ) * finalStock

        let sell = parseInt(
            replaceChar( form.getFieldValue( 'selling' ) ) 
        ) * finalStock
        
        if( action.mode === 'add' ) {
            setTotal( { total_investment: inv, exp_return: sell } )
        } else {
            form.setFieldsValue({
                total_investment: inv,
                exp_return: sell
            })
        }

        handleFormChange()
    }

    const amountChange = ( e, name ) => {

        let amount = parseInt(
            replaceChar( e.target.value ) 
        )
        
        let totalAmount = form.getFieldValue( 'stock' ) * amount

        setTotal( { ...total, [ name ] : totalAmount } )

        if( action.mode === 'put' ) {
            form.setFieldsValue({
                [ name ]: totalAmount
            })
        } 
    }

    const setPurchase = ( set ) => {

        let stock = parseInt( form.getFieldValue( 'stock' ) )
        let value = parseInt( form.getFieldValue( 'add_or_less_stock' ) ) || 0

        if( set === 'minus' ) {
            value -= 1
            stock += 1
        } else if( set === 'plus' ){
            value += 1
            stock -= 1
        } else {
            value = set.target.value
            stock = stockHistory.stock_history - set.target.value
        }

        if( value > stockHistory.stock_history ) {
            value = stockHistory.stock_history
            stock = stockHistory.stock_history - value
        }

        let finalPurchase = value

        if( value <= 0 ) {
            finalPurchase = 1
            stock = stockHistory.stock_history - 1
        }

        form.setFieldsValue({
            add_or_less_stock: finalPurchase,
            stock: stock,
            purchase_amount: parseInt(
                replaceChar( form.getFieldValue( 'selling' ) ) 
            ) * finalPurchase
        })

        handleFormChange()
    }

    const generateRefNo = () => {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let result = ''
        const charactersLength = characters.length
        for ( let i = 0; i < 10; i++ ) {
            result += characters.charAt( Math.floor(Math.random() * charactersLength ) )
        }

        return 'TY-' + result
    }

    const onFinish = ( values ) => {

        values.investment = replaceChar( values.investment )
        values.selling = replaceChar( values.selling )

        
        let url = `${ baseUrl }/add-product`
        let data = { ...values, ...total }

        if( action.mode === 'put' ) {
            url = `${ baseUrl }/put-product/${ action.id }`
            values.receipt_ref_num = generateRefNo()
            values.stock_history = stockHistory.stock_history
            data = values
        }

        axios.post( 
            url,
            { ...data } 
        ).then( res => {

            if( action.mode === 'put' ) {
                setDrawer( { ...drawer, open : false  } )
            }
            form.resetFields()
            setHasErrors( true )
            setTotal({
                total_investment: 0,
                exp_return: 0
            })

            if( values.add_or_less_stock !== undefined ) {
                openNotification(
                    'Receipt is Ready',
                    'Receipt successfully Generated'
                )
            } else {
                openNotification(
                    `${ action.mode === 'put' ? 'Update' : 'Creation of' } Product `,
                    `Product successfully ${ action.mode === 'put' ? 'changed' : 'added' }`
                )
            }
            

            loadData()
        })
    }

    const deleteRecord = () => {
        axios.post( 
            `${ baseUrl }/delete-product/${ action.id }`,
        ).then( res => {
            openNotification(
                `Record successfully deleted`,
                `Deleted Product`
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
    
    // render stock style
    const renderStock = () => {
        return (
            <Form.Item
                label='Stock'
                name='stock'
                className='text-center'
                initialValue={ 1 }
                rules={ [ 
                    { 
                        required: true, 
                        message: 'Stock number is required' 
                    } 
                ] }
            >
                <Input 
                    type='number'
                    className='stock-input text-center'
                    disabled={ withReceipt }
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
                    placeholder='# of Stock'
                />
            </Form.Item> 
        )
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
                    <label className='text-muted text-xs pt-2 d-block'>Complete Product Details</label>
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
                            label='Name'
                            name='name'
                            rules={ [ 
                                { 
                                    required: true, 
                                    message: 'Product name is required' 
                                } 
                            ] }
                        >
                            <Input 
                                size='large'
                                placeholder='Name of Product'
                            />
                        </Form.Item> 
                        <Form.Item
                            label='Category'
                            name='category_id'
                            rules={ [ 
                                { 
                                    required: true, 
                                    message: 'Category is required' 
                                } 
                            ] }
                        >
                            
                            <Select
                                size='large'
                                showSearch
                                placeholder='Search to Select'
                            >
                                { category.map( ( value, key ) => (
                                        <Select.Option
                                            value={ value.id }
                                            key={ key }
                                        >
                                            { value.name }
                                        </Select.Option> 
                                    ))}
                                
                            </Select>
                        </Form.Item> 
                        {/* generate stock here if its add mode */}
                        {
                            action.mode === 'add' && 
                            renderStock()
                        }
                        <Form.Item
                            label='Investment'
                            name='investment'
                            rules={ [ 
                                { 
                                    required: true, 
                                    message: 'Investment amount is required' 
                                } 
                            ] }
                        >
                            <CurrencyFormat  
                                size='large'
                                className='ant-input-lg w-100 text-end'
                                placeholder='0.00'
                                prefix={'₱'}
                                thousandSeparator={ true }
                                onChange={ e => amountChange( e, 'total_investment' ) }
                                style={{
                                    marginBottom: action.mode === 'add' ? -20 : 0
                                }}
                            />
                            
                        </Form.Item> 
                        {
                            action.mode === 'add' && 
                            <label
                                className='text-muted pb-3'
                            >
                                Total Investment: 
                                <span className='font-weight-bold'>
                                    <CurrencyFormat 
                                        value={ total.total_investment } 
                                        displayType={ 'text' } 
                                        thousandSeparator={ true } 
                                        prefix={'₱'} 
                                        disabled={ true }
                                    />
                                </span>
                            </label>
                        }
                        <Form.Item
                            label='Selling Price'
                            name='selling'
                            rules={ [ 
                                { 
                                    required: true, 
                                    message: 'Selling price is required' 
                                } 
                            ] }
                        >
                            <CurrencyFormat  
                                size='large'
                                className='ant-input-lg w-100 text-end'
                                placeholder='0.00'
                                prefix={'₱'}
                                thousandSeparator={ true }
                                onChange={ e => amountChange( e, 'exp_return' ) }
                                style={{
                                    marginBottom: -20
                                }}
                            />
                            
                        </Form.Item> 
                        {
                            action.mode === 'add' && 
                            <label
                                className='text-muted pb-2'
                            >
                                Expected Return: 
                                <span className='font-weight-bold'>
                                    <CurrencyFormat 
                                        value={ total.exp_return } 
                                        displayType={ 'text' } 
                                        thousandSeparator={ true } 
                                        prefix={'₱'} 
                                        disabled={ true }
                                    />
                                </span>
                            </label>
                        }
                        {
                            action.mode === 'put' &&
                            <div className='pt-3'>
                                <label className='text-muted'>Edit Stock</label>
                                <div className='buttons-stock pt-2'>
                                    <Button
                                            type={ `${ ( !withReceipt ) ? 'primary' : 'default' }` }
                                            className='action-btn-half btn-left'
                                            size='large'
                                            onClick={ e => {
                                                setWithReceipt( !withReceipt )
                                                form.setFieldsValue( realRecord )
                                                setHasErrors( false )
                                            }}
                                        >
                                            Manual
                                    </Button>
                                    <Button
                                            type={ `${ ( withReceipt ) ? 'primary' : 'default' }` }
                                            className='action-btn-half btn-right'
                                            size='large'
                                            onClick={ e => {
                                                setWithReceipt( !withReceipt )
                                                form.setFieldsValue( { 
                                                    ...realRecord, 
                                                    add_or_less_stock: '',

                                                } )
                                                setHasErrors( true )
                                            }}
                                        >
                                            With Receipt
                                    </Button>
                                </div>
                                <div className='stock-input-container pt-4'>
                                    {
                                        renderStock()
                                    }
                                    <Form.Item
                                        className='pt-2'
                                        label='Total Investment'
                                        name='total_investment'
                                        
                                        rules={ [ 
                                            { 
                                                required: true, 
                                                message: 'Total Investment amount is required' 
                                            } 
                                        ] }
                                    >
                                        <CurrencyFormat  
                                            disabled={ withReceipt }
                                            size='large'
                                            className='ant-input-lg w-100 text-end'
                                            placeholder='0.00'
                                            prefix={'₱'}
                                            thousandSeparator={ true }
                                        />
                                        
                                    </Form.Item> 
                                    <Form.Item
                                        label='Expected Return'
                                        name='exp_return'
                                        rules={ [ 
                                            { 
                                                required: true, 
                                                message: 'Expected Return Amount is required' 
                                            } 
                                        ] }
                                    >
                                        <CurrencyFormat  
                                            disabled={ withReceipt }
                                            size='large'
                                            className='ant-input-lg w-100 text-end'
                                            placeholder='0.00'
                                            prefix={'₱'}
                                            thousandSeparator={ true }
                                        />
                                        
                                    </Form.Item> 
                                    <div 
                                        className='mb-4'
                                        style={{
                                            height: 1,
                                            width: 100,
                                            margin: 'auto' ,
                                            background: '#cccc'
                                        }}
                                    />
                                    {
                                        withReceipt &&
                                        <>
                                            <Form.Item
                                                label='# of Purchase'
                                                name='add_or_less_stock'
                                                className='text-center'
                                                rules={ [ 
                                                    { 
                                                        required: true, 
                                                        message: 'Number of Purchase is required' 
                                                    } 
                                                ] }
                                            >
                                                <Input 
                                                    type='number'
                                                    max={ form.getFieldValue( 'stock' ) }
                                                    className='stock-input text-center'
                                                    suffix={
                                                        <PlusOutlined 
                                                            onClick={ 
                                                                e => setPurchase( 'plus' )
                                                            }
                                                        />
                                                    }
                                                    prefix={
                                                        <MinusOutlined 
                                                            onClick={ 
                                                                e => setPurchase( 'minus' )
                                                            }
                                                        />
                                                    }
                                                    onChange={ 
                                                        e => setPurchase( e )
                                                    }
                                                    size='large'
                                                    placeholder='# of Purchase'
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
                                        </>
                                    }
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
                                </div>
                            </div>
                        }
                    </Form>
                    
                </div>
            </Drawer>

            <Wrapper
                title={ 'Product' }
                subtitle={ 'Manage list of Product' }
            >
                <Button
                    onClick = { e => { renderDrawer( 'Add new Product' ) } }
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
                        fileName: 'Product List',
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

export default connect( mapStateToProps )( Product )
