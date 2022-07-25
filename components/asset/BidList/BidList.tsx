import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React from 'react'
import { Bid } from '../../../utils/subgraph'
import BidAction from '../BidAction/BidAction'

type Props = {
    bids: Bid[]
}

const columns: ColumnsType<Bid> = [
    {
        title: 'Bidder',
        dataIndex: 'bidder',
        key: 'bidder',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    },
    // {
    //     title: 'Action',
    //     key: 'action',
    //     render: (_, bid) => <BidAction bid={bid} />,
    // },
];

const BidList = (props: Props) => {
    return (
        <Table
            pagination={false}
            columns={columns}
            dataSource={props.bids}
            rowKey="id" />
    )
}

export default BidList