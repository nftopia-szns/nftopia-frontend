/**
 * Search queries
 */

import { GenericAssetDto } from "nftopia-shared/dist/shared/asset/types"

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

export const EmptySearchResultDto: SearchResultDto<GenericAssetDto> = {
    total: 0,
    max_score: 0,
    hits: []
}