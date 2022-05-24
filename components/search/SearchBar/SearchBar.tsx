import Search from "antd/lib/input/Search"
import { FC } from "react"
import { SearchEvents } from "../search.types"
import { SearchBarProps } from "./SearchBar.types"

const SearchBar: FC<SearchBarProps> = ({ 
    loading,
    searchEvent,
    setSearchQuery,
 }) => {

    const onSelectPlatform = () => {
        // change the platform
        // setPlatform(???)
    }

    const onSearch = async (query: string) => {
        setSearchQuery(query)
        searchEvent.emit(SearchEvents.SEARCH_ON_BAR, query)
    }

    return (
        <>
            <Search
                placeholder="search for coordinate, name, description..."
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
                loading={loading}
            />
        </>
    )
}

export default SearchBar