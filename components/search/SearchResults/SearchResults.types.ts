import EventEmitter from "events";
import { Dispatch, SetStateAction } from "react";
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform"

export interface SearchResultsProps {
    searchEvent: EventEmitter
    platform: MetaversePlatform
    searchQuery: string
    setLoading: Dispatch<SetStateAction<boolean>>
}