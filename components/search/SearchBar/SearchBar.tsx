import { DownOutlined } from "@ant-design/icons"
import { Button, Col, Dropdown, Menu, MenuProps, Row, Space } from "antd"
import Search from "antd/lib/input/Search"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../services/hook"
import { searchStart, rQuery, rPlatform } from "../../../services/search/search-slice"
import { MetaversePlatformOptions } from "../../../services/search/search.types"
import { buildSearchDtoFromState } from "../../../services/search/search.utils"
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform"
import { t } from "../../../utils/translation"
import SearchSorting from "../SearchSorting/SearchSorting"
import "./SearchBar.module.css"

const DefaultMetaversePlatform = MetaversePlatform.Decentraland

const SearchBar: FC = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const isLoading = useAppSelector((state) => state.search.isLoading)
    const searchState = useAppSelector((state) => state.search)
    const page = useAppSelector((state) => state.search.page)
    const pageSize = useAppSelector((state) => state.search.pageSize)

    const [metaversePlatform, setMetaversePlatform] = useState<MetaversePlatform>(searchState.platform)

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

    const onMetaversePlatformChange: MenuProps['onClick'] = ({ key }) => {
        setMetaversePlatform(key as MetaversePlatform)
        dispatch(rPlatform(key as MetaversePlatform))
    }

    const metaversePlatformMenu = (
        <Menu
            onClick={onMetaversePlatformChange}
            defaultSelectedKeys={[DefaultMetaversePlatform]}
            items={
                MetaversePlatformOptions.map((v) => ({
                    label: t(v),
                    key: v,
                }))
            }
        />
    );

    return (
        <>
            <Col span={6}>
                <Row>
                    <Col>
                        <Button>Show/Hide Filter</Button>
                    </Col>
                    <Col span={3}></Col>
                    <Col>
                        <Dropdown overlay={metaversePlatformMenu} trigger={['click']}>
                            <a onClick={e => e.preventDefault()}>
                                <Space>
                                    {t(metaversePlatform)}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </Col>
                </Row>
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
                <SearchSorting platform={metaversePlatform} />
            </Col>
        </>
    )
}

export default SearchBar