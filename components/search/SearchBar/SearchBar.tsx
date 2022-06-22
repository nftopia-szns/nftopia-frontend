import { DownOutlined } from "@ant-design/icons"
import { Button, Col, Dropdown, Menu, MenuProps, Space } from "antd"
import Search from "antd/lib/input/Search"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../services/hook"
import { searchStart, rQuery, rPlatform, rDecentralandSearchState } from "../../../services/search/search-slice"
import { buildSearchDtoFromState } from "../../../services/search/search.utils"
import { DecentralandSortByCriterias, MetaversePlatform } from "../search.types"
import "./SearchBar.module.css"

const DefaultMetaversePlatform = MetaversePlatform.Decentraland

const SearchBar: FC = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const isLoading = useAppSelector((state) => state.search.isLoading)
    const searchState = useAppSelector((state) => state.search)
    const platformSearchState = useAppSelector((state) => state.search.platformSearchState)
    const page = useAppSelector((state) => state.search.page)
    const pageSize = useAppSelector((state) => state.search.pageSize)

    const [metaversePlatform, setMetaversePlatform] = useState<MetaversePlatform>(searchState.platform)
    const [decentralandSortingCriteria, setDecentralandSortingCriteria] = useState<DecentralandSortByCriterias>(DecentralandSortByCriterias.Price)

    const [searchString, setSearchString] = useState<string>()
    const [parsedFromUrl, setParsedFromUrl] = useState<boolean>(false)

    useEffect(() => {
        dispatch(rPlatform(DefaultMetaversePlatform))
    }, [])

    useEffect(() => {
        // below code is expected to execute only once when the query in url is ready
        const _query = router.query.query

        if (!parsedFromUrl) {
            if (typeof _query === 'string' && _query !== '') {
                setParsedFromUrl(true)
                dispatch(rQuery(_query))
                handleSearch(_query)
            }
        } else {
            setParsedFromUrl(true)
        }
    }, [parsedFromUrl, router])

    const onChangingQuery = (e) => {
        const _query = e.target.value
        setSearchString(_query)
        dispatch(rQuery(_query))
    }

    useEffect(() => {
        if (searchString) {
            // update query params in url while typing in search box
            router.replace(`${router.route}?query=${searchString}&page=${page}&pageSize=${pageSize}`)
        }
    }, [searchString, page, pageSize])

    const handleSearch = async (_query: string) => {
        setSearchString(_query)
        const searchDto = buildSearchDtoFromState(searchState)
        dispatch(searchStart(searchDto))
    }

    const onDecentralandSortingChange: MenuProps['onClick'] = ({ key }) => {
        setDecentralandSortingCriteria(key as DecentralandSortByCriterias)
        dispatch(rDecentralandSearchState({
            ...platformSearchState,
            sortBy: key as DecentralandSortByCriterias
        }))
    }

    const onMetaversePlatformChange: MenuProps['onClick'] = ({ key }) => {
        setMetaversePlatform(key as MetaversePlatform)
        dispatch(rPlatform(key as MetaversePlatform))
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

    const metaversePlatformMenu = (
        <Menu
            onClick={onMetaversePlatformChange}
            defaultSelectedKeys={[DefaultMetaversePlatform]}
            items={[
                {
                    label: "Decentraland",
                    key: MetaversePlatform.Decentraland,
                },
                {
                    label: "The Sandbox",
                    key: MetaversePlatform.SandBox,
                },
            ]}
        />
    );

    const getSortingComponent = (p: MetaversePlatform) => {
        switch (p) {
            case MetaversePlatform.SandBox:
                return null
            case MetaversePlatform.Decentraland:
            default:
                return <Dropdown overlay={decentralandSortingMenu} trigger={['click']}>
                    <a onClick={e => e.preventDefault()}>
                        <Space>
                            {decentralandSortingCriteria}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
        }
    }

    return (
        <>
            <Col span={6}>
                <Col span={3}>
                    <Dropdown overlay={metaversePlatformMenu} trigger={['click']}>
                        <a onClick={e => e.preventDefault()}>
                            <Space>
                                {metaversePlatform}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </Col>
                <Col span={3}>
                    <Button>Show/Hide Filter</Button>
                </Col>
            </Col>

            <Col span={12}>
                <Search
                    placeholder="search for coordinate, name, description..."
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={handleSearch}
                    loading={isLoading}
                    onChange={onChangingQuery}
                    value={searchString}
                />
            </Col>

            <Col span={6}>
                {getSortingComponent(metaversePlatform)}
            </Col>
        </>
    )
}

export default SearchBar