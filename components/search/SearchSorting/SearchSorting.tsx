import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Menu, MenuProps, Space } from 'antd'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../services/hook'
import { rPlatformSearchState } from '../../../services/search/search-slice'
import { MetaversePlatform, DecentralandSortByCriterias } from '../../../services/search/search.types'

type Props = {
    platform: MetaversePlatform
}



const SearchSorting = (props: Props) => {
    const { platform } = props
    const dispatch = useAppDispatch()
    const platformSearchState = useAppSelector((state) => state.search.platformSearchState)

    const [decentralandSortingCriteria, setDecentralandSortingCriteria] = useState<DecentralandSortByCriterias>(DecentralandSortByCriterias.Price)

    const onDecentralandSortingChange: MenuProps['onClick'] = ({ key }) => {
        setDecentralandSortingCriteria(key as DecentralandSortByCriterias)
        dispatch(rPlatformSearchState({
            ...platformSearchState,
            sortBy: key as DecentralandSortByCriterias
        }))
    }

    const decentralandSortingMenu = (
        <Menu
            onClick={onDecentralandSortingChange}
            defaultSelectedKeys={[DecentralandSortByCriterias.Price]}
            items={[
                {
                    label: "Price",
                    key: DecentralandSortByCriterias.Price,
                },
                {
                    label: "Recently listed",
                    key: DecentralandSortByCriterias.RecentlyListed,
                },
                {
                    label: 'Recently bought',
                    key: DecentralandSortByCriterias.RecentlyBought,
                },
                {
                    label: 'Total sales',
                    key: DecentralandSortByCriterias.TotalSales,
                },
            ]}
        />
    );
    
    switch (platform) {
        case MetaversePlatform.Decentraland:
            return <Dropdown overlay={decentralandSortingMenu} trigger={['click']}>
                <a onClick={e => e.preventDefault()}>
                    <Space>
                        {decentralandSortingCriteria}
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
        case MetaversePlatform.SandBox:
            return null
        default:
            return null
    }
}

export default SearchSorting