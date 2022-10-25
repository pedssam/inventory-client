import React, { Fragment, useEffect, useState } from 'react'

// component
import Wrapper from '../components/wrapper'

// antd
import { Table } from 'antd'

const Category = () => {

    useEffect( () => {
        loadData()
    }, [ ] )

    const [ loading, setLoading ] = useState( true )

    const columns = [
        {
            title: "Select",
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Supplier",
            dataIndex: "supplier",
        },
        {
            title: "Code",
            dataIndex: "code",
        },
    ]

    const loadData = () => {
        setLoading( true )
    }

    return (
        <Fragment>
            <Wrapper
                title={ 'Category' }
                subtitle={ 'Manage list of Category' }
            >
                <Table
                    className='ant-table-content'
                    loading={ loading }
                    columns={ columns }
                />
            </Wrapper>
        </Fragment>
    )
}

export default Category