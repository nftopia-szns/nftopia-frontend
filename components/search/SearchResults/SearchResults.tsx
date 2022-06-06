import { Row, Col, Divider, Pagination } from "antd"
import { useEffect, useState } from "react"
import { DecentralandSearchHitDto, SearchHitDto } from "../search.types"
import DecentralandSearchResult from "./DecentralandSearchResult/DecentralandSearchResult"
import { Typography } from 'antd';
const { Text } = Typography;
import { useAppDispatch, useAppSelector } from "../../../modules/hook"
import { searchStart, pageChange, pageSizeChange } from "../../../modules/search/search-slice"
import "./SearchResults.module.css"
import { useRouter } from "next/router";

const SearchResults = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const searchState = useAppSelector((state) => state.search)
    const searchResults = useAppSelector((state) => state.search.searchResult)

    useEffect(() => {
        // below code is expected to execute only once when the query in url is ready
        const _page = router.query.page
        const _pageSize = router.query.pageSize
        if (_page) {
            const __page = Number(router.query.page.toString())
            if (__page !== searchState.page) {
                dispatch(pageChange(__page))
            }
        }
        if (_pageSize) {
            const __pageSize = Number(router.query.pageSize.toString())
            if (__pageSize) {
                dispatch(pageSizeChange(__pageSize))
            }
        }
    }, [router])

    const onChange = (page: number, pageSize: number) => {
        dispatch(pageChange(page))
        dispatch(pageSizeChange(pageSize))
        dispatch(searchStart({ query: searchState.query, page, pageSize }))
    }

    return (<>
        {searchResults?.total > 0 ?
            < Text > Total : {searchResults.total} result{searchResults.total >= 2 ? 's' : ''}</Text> :
            <Text>Total: No result</Text>
        }
        <Divider />
        <Row id="search-results" gutter={2}>
            {searchResults?.hits.map((_searchHit) =>
                <Col key={`${_searchHit._index}${_searchHit._id}`} span={4}>
                    <DecentralandSearchResult
                        searchHit={_searchHit as SearchHitDto<DecentralandSearchHitDto>} />
                </Col>
            )}
        </Row>
        <Divider />
        <Pagination
            defaultCurrent={searchState.pageSize}
            total={searchResults?.total}
            onChange={onChange}
        />
    </>
    )
}

export default SearchResults