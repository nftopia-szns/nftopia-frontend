import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Menu, MenuProps, Space } from 'antd'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../services/hook'
import { rPlatformSearchState } from '../../../services/search/search-slice'
import { MetaversePlatform, DecentralandSortByCriterias, DecentralandSortByCriteriasOptions, DecentralandSearchState } from '../../../services/search/search.types'
import { t } from '../../../utils/translation'

type Props = {
    platform: MetaversePlatform
}

const SearchSorting = (props: Props) => {
    const { platform } = props
    const dispatch = useAppDispatch()
    const platformSearchState = useAppSelector((state) => state.search.platformSearchState as DecentralandSearchState)

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
            items={
                DecentralandSortByCriteriasOptions.map((v) => ({
                    label: t(v),
                    key: v,
                }))
            }
        />
    );

    switch (platform) {
        case MetaversePlatform.Decentraland:
            return <Dropdown overlay={decentralandSortingMenu} trigger={['click']}>
                <a onClick={e => e.preventDefault()}>
                    <Space>
                        {t(decentralandSortingCriteria)}
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
        case MetaversePlatform.SandBox:
            return null
        case MetaversePlatform.Cryptovoxels:
            return null
        default:
            return null
    }
}

export default SearchSorting