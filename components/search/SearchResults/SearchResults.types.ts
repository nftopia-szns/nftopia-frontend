import EventEmitter from "events";
import { Dispatch, SetStateAction } from "react";
import { MetaversePlatform } from "../../../services/search/search.types";

export interface SearchResultsProps {
    searchEvent: EventEmitter
    platform: MetaversePlatform
    searchQuery: string
    setLoading: Dispatch<SetStateAction<boolean>>
}