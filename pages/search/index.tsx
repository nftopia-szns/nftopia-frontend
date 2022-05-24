import EventEmitter from "events"
import { useState } from "react"
import { SearchBar, SearchResults } from "../../components/search"
import { SearchResultDto, SearchHitBase } from "../../components/search/search.types"
import { MetaversePlatform } from "../../components/search/SearchBar/SearchBar.types"

const SearchPage = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const [searchEvent, _] = useState<EventEmitter>(new EventEmitter())
    const [platform, setPlatform] = useState<MetaversePlatform>(MetaversePlatform.Decentraland)
    const [searchQuery, setSearchQuery] = useState<string>()
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)

    return <>
        <SearchBar
            searchEvent={searchEvent}
            setSearchQuery={setSearchQuery}
            setPlatform={setPlatform}
            loading={loading} />
        <SearchResults
            searchEvent={searchEvent}
            setLoading={setLoading}
            platform={platform}
            searchQuery={searchQuery} />
    </>
}

export default SearchPage