GET /decentraland-ethereum-3/_search
{
    "query": {
        "match": {
            "id": "parcel-0x7a73483784ab79257bb11b96fd62a2c3ae4fb75b-115792089237316195423570985008687907839318407621882087037459225103210632970096"
        }
    }
}

GET /decentraland-ethereum-3/_search
{
    "query": {
        "bool": {
            "must": [
                {
                    "multi_match": {
                        "query": "a",
                        "fields": [
                            "name",
                            "description",
                            "attributes.coordinate",
                            "owner"
                        ]
                    }
                },
                {
                    "terms": {
                        "category": [
                            "estate",
                            "parcel"
                        ]
                    }
                }
            ]
        }
    }
}

GET /decentraland-ethereum-3/_search
{
    "query": {
        "match_all": {}
    }
}

GET /decentraland-ethereum-3/_search
{
    "query": {
        "match": {
            "token_id": "30625413022884461711703714668859139030897"
        }
    }
}

DELETE /decentraland-ethereum-3

GET /decentraland-ethereum-3/_search
{
    "query": {
        "bool": {
            "should": [
              { 
                "match": {
                  "category": "parcel"
                }
              },
              { 
                "match": {
                  "category": "estate"
                }
              }
            ],
            "must": [
                // {
                //     "multi_match": {
                //         "query": "a",
                //         "fields": [
                //             "name",
                //             "description",
                //             "attributes.coordinate",
                //             "owner"
                //         ]
                //     }
                // },
                // {
                //     "range": {
                //         "active_order.price": {}
                //     }
                // },
                // {
                //     "match": {
                //         "sold_at": 0
                //     }
                // },
                // {
                //     "terms": {
                //         "category": [
                //             "estate",
                //             "parcel"
                //         ]
                //     }
                // }
                // {
                //   "exists": {
                //         "field": "active_order"
                //   }
                // }
            ],
            "must_not": [
                {
                  "exists": {
                        "field": "active_order"
                  }
                }
            ]
        }
    }
}