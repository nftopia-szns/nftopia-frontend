import EventEmitter from "events"
import { Dispatch, SetStateAction } from "react"

export enum MetaversePlatform {
    Decentraland,
}

export interface SearchBarProps {
    loading: boolean
    searchEvent: EventEmitter
    setSearchQuery: Dispatch<SetStateAction<string>>
    setPlatform: Dispatch<SetStateAction<MetaversePlatform>>
}