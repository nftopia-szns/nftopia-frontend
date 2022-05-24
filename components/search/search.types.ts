export enum SearchEvents {
    SEARCH_ON_BAR = 'search_on_bar',
    SEARCH_ON_PAGING = 'search_on_paging',
}

export interface SearchQueryDto {
    query: string
    page: number
    pageSize: number
}

export interface SearchResultDto<T> {
    total: number
    max_score: number
    hits: SearchHitDto<T>[]
}

export interface SearchHitDto<T> {
    _index: string,
    _id: string,
    _score: number,
    _source: T
}

/**
 * This interface just an empty base object
 */
export interface SearchHitBase { }

export interface DecentralandSearchHitDto extends SearchHitBase {
    id: string
    name: string
    description: string
    image: string
    attributes: {
        x: number
        y: number
        distance_to_plaza?: number
        distance_to_district?: number
        distance_to_road?: number
    }
}

export const EmptySearchResultDto: SearchResultDto<SearchHitBase> = {
    total: 0,
    max_score: 0,
    hits: []
}