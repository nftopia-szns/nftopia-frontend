import { Row, Col, Divider, Pagination } from "antd"
import { FC, useCallback, useEffect, useState } from "react"
import { DecentralandSearchHitDto, EmptySearchResultDto, SearchEvents, SearchHitBase, SearchHitDto, SearchResultDto } from "../search.types"
import DecentralandSearchResult from "./DecentralandSearchResult/DecentralandSearchResult"
import { SearchResultsProps } from "./SearchResults.types"
import { Typography } from 'antd';
const { Text } = Typography;
import "./SearchResults.module.css"
import search from "../../../pages/api/search"

import { MetaversePlatform } from "../SearchBar/SearchBar.types"

const SearchResults: FC<SearchResultsProps> = ({
    searchEvent,
    platform,
    setLoading,
}) => {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [searchResults, setSearchResults] = useState<SearchResultDto<SearchHitBase>>(EmptySearchResultDto)
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)

    useEffect(() => {
        searchEvent.on(SearchEvents.SEARCH_ON_BAR, async (_query: string) => {
            console.log('search on bar', _query, page, pageSize);
            
            setSearchQuery(_query)
            await onSearch(_query, page, pageSize)
        })

        searchEvent.on(SearchEvents.SEARCH_ON_PAGING, async (_query, _page: number, _pageSize: number) => {
            console.log('search on paging', _query, _page, _pageSize);
            
            await onSearch(_query, _page, _pageSize)
        })
    }, [])

    const onSearch = useCallback(async (_query: string, _page: number, _pageSize: number) => {
        setLoading(true)
        let _searchResults: SearchResultDto<SearchHitBase> = EmptySearchResultDto
        switch (platform) {
            case MetaversePlatform.Decentraland:
            default:
                _searchResults = await search<DecentralandSearchHitDto>(_query, _page, _pageSize)
        }

        setSearchResults(_searchResults)
        setLoading(false)
    }, [searchQuery, page, pageSize])

    const onChange = (page: number, pageSize: number) => {
        setPage(page)
        setPageSize(pageSize)
        searchEvent.emit(SearchEvents.SEARCH_ON_PAGING, searchQuery, page, pageSize)
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
            defaultCurrent={pageSize}
            total={searchResults?.total}
            onChange={onChange}
        />
    </>
    )
}

export default SearchResults