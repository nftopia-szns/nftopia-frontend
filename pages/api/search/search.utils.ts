import { FieldQuery, IQuery, IQueryBuilder } from "./search.types";

export class QueryBuilder implements IQueryBuilder {
    multimatchQuery(this: IQueryBuilder, query: string, fields: string[]): IQuery {
        this.multi_match = {
            query,
            fields
        }

        return this
    }
    matchQuery(this: any, fieldQueries: FieldQuery[]): IQuery {
        this.match = {}
        for (const fieldQuery of fieldQueries) {
            this.match[fieldQuery.field] = fieldQuery.query
        }
        return this
    }
}