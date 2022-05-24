import EventEmitter from "events";
import { Dispatch, SetStateAction } from "react";
import { SearchHitBase, SearchResultDto } from "../search.types";
import { MetaversePlatform } from "../SearchBar/SearchBar.types";

export interface SearchResultsProps {
    searchEvent: EventEmitter
    platform: MetaversePlatform
    searchQuery: string
    setLoading: Dispatch<SetStateAction<boolean>>
}