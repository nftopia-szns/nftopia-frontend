import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { Ask } from 'nftopia-shared/dist/shared'
import React from 'react'
import AskActions from './AskActions'

type Props = {
    asks: Ask[]
}

const columns: ColumnsType<Ask> = [
    {
        title: 'Seller',
        dataIndex: 'seller',
        key: 'seller',
    },
    {
        title: 'Currency',
        dataIndex: 'quoteToken',
        key: 'quoteToken'
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, ask) => <AskActions ask={ask} />,
    },
];

const AskList = (props: Props) => {
    return (
        <Table
            pagination={false}
            columns={columns}
            dataSource={props.asks}
            rowKey="id" />
    )
}

export default AskList