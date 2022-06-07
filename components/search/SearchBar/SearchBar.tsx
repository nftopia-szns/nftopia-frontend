import Search from "antd/lib/input/Search"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../modules/hook"
import { searchStart, queryChange } from "../../../modules/search/search-slice"
import { SearchDto } from "../../../pages/api/search/search.types"
import { QueryBuilder } from "../../../pages/api/search/search.utils"

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

        if (typeof _query === 'string' && _query !== '') {
            if (!parsedFromUrl) {
                setParsedFromUrl(true)
                dispatch(queryChange(_query))
                handleSearch(_query)
            }
        } else {
            setParsedFromUrl(true)
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
        const query = new QueryBuilder()
            .multimatchQuery(
                _query,
                ["name", "description", "attributes.coordinate"]
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