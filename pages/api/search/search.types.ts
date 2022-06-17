/**
 * Search queries
 */

export interface SearchDto {
    indices: string[]
    query: IQuery | object
    page?: number
    pageSize?: number
}

export interface IQuery {
    multi_match?: IMultimatchQuery
    match?: object
}

export interface IMultimatchQuery {
    query: string
    fields: string[]
}

export interface FieldQuery {
    field: string,
    query: any,
}

export interface IQueryBuilder extends IQuery {
    multimatchQuery(this, query: string, fields: string[]): IQuery
    matchQuery(this, fieldQueries: FieldQuery[]): IQuery
}

/**
 * Search results
 */
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

// This interface just an empty base object
export interface SearchHitBase { }

export interface DecentralandSearchHitDto extends SearchHitBase {
    id: string
    owner: string
    network: string
    chain_id: number
    contract_address: string
    token_id: string
    category: string
    name: string
    description: string
    image: string
    external_url: string
    attributes: {
        x: number
        y: number
        size?: number
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