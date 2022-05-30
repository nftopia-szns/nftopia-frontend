import Search from "antd/lib/input/Search"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hook"
import { searchStart, queryChange } from "../../../redux/features/search/search-slice"
import { MetaversePlatform } from "./SearchBar.types"

const SearchBar = () => {
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
            setParsedFromUrl(true)
            if (typeof _query === 'string' && _query !== '') {
                dispatch(queryChange(_query))
                handleSearch(_query)
            }
        }
    }, [parsedFromUrl, router])

    const onChangingQuery = (e) => {
        const _query = e.target.value
        setSearchString(_query)
        dispatch(queryChange(_query))
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
        dispatch(searchStart({ query: _query, page, pageSize }))
    }

    return (
        <>
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
        </>
    )
}

export default SearchBar