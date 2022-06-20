import { DownOutlined } from "@ant-design/icons"
import { Button, Col, Dropdown, Menu, MenuProps, Space } from "antd"
import Search from "antd/lib/input/Search"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../services/hook"
import { searchStart, rQuery, rSortBy } from "../../../services/search/search-slice"
import { buildSearchDtoFromState } from "../../../services/search/search.utils"
import { SortByCriterias } from "../search.types"
import "./SearchBar.module.css"

const SearchBar: FC = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const isLoading = useAppSelector((state) => state.search.isLoading)
    const searchState = useAppSelector((state) => state.search)
    const page = useAppSelector((state) => state.search.page)
    const pageSize = useAppSelector((state) => state.search.pageSize)

    const [sortingCriteria, setSortingCriteria] = useState<SortByCriterias>(SortByCriterias.Price)

    const [searchString, setSearchString] = useState<string>()
    const [parsedFromUrl, setParsedFromUrl] = useState<boolean>(false)

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

    const onSelectPlatform = () => {
        // change the platform
        // setPlatform(???)
    }

    const handleSearch = async (_query: string) => {
        setSearchString(_query)
        const searchDto = buildSearchDtoFromState(searchState)
        dispatch(searchStart(searchDto))
    }

    const onSortingChange: MenuProps['onClick'] = ({ key }) => {
        setSortingCriteria(key as SortByCriterias)
        dispatch(rSortBy(key as SortByCriterias))
    }

    const sortingMenu = (
        <Menu
            onClick={onSortingChange}
            defaultSelectedKeys={[SortByCriterias.Price]}
            items={[
                {
                    label: "Price",
                    key: SortByCriterias.Price,
                },
                {
                    label: "Recently listed",
                    key: SortByCriterias.RecentlyListed,
                },
                {
                    label: 'Recently bought',
                    key: SortByCriterias.RecentlyBought,
                },
                {
                    label: 'Total sales',
                    key: SortByCriterias.TotalSales,
                },
            ]}
        />
    );

    return (
        <>
            <Col span={6}>
                <Button>Show/Hide Filter</Button>
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
                <Dropdown overlay={sortingMenu} trigger={['click']}>
                    <a onClick={e => e.preventDefault()}>
                        <Space>
                            {sortingCriteria}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Col>
        </>
    )
}

export default SearchBar