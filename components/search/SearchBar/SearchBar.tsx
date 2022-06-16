import { DownOutlined } from "@ant-design/icons"
import { Button, Col, Dropdown, Menu, Row, Space } from "antd"
import Search from "antd/lib/input/Search"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../modules/hook"
import { searchStart, rQuery } from "../../../modules/search/search-slice"
import { SearchDto } from "../../../pages/api/search/search.types"
import { QueryBuilder } from "../../../pages/api/search/search.utils"
import "./SearchBar.module.css"

const SearchBar: FC = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const isLoading = useAppSelector((state) => state.search.isLoading)
    const page = useAppSelector((state) => state.search.page)
    const pageSize = useAppSelector((state) => state.search.pageSize)

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
        const query = new QueryBuilder()
            .multimatchQuery(
                _query,
                ["name", "description", "attributes.coordinate", "owner"]
            )

        const searchDto: SearchDto = {
            // TODO: remove hardcoded
            indices: ["decentraland-ethereum-3"],
            query,
            page,
            pageSize,
        }
        dispatch(searchStart(searchDto))
    }

    const menu = (
        <Menu
            items={[
                {
                    label: "Price",
                    key: '0',
                },
                {
                    label: "Recently listed",
                    key: '1',
                },
                {
                    label: 'Recently bought',
                    key: '2',
                },
                {
                    label: 'Total sales',
                    key: '3',
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
                <Dropdown overlay={menu} trigger={['click']}>
                    <a onClick={e => e.preventDefault()}>
                        <Space>
                            Sorting criteria
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Col>
        </>
    )
}

export default SearchBar