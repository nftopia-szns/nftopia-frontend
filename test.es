GET /decentraland-ethereum-mainnet/_search
{
    "query": {
        "match_all": {}
    }
}

PUT /testplatform-polygon-mumbai/_doc/1
{
    "platform": "testplatform",
    "network": "polygon",
    "chain_id": "mumbai",
    "contract_address": "0x2faac886960981cd3811329b02816f5a6a9b5d87",
    "id": "1",
    "name": "1",
    "description": "1",
    "owner": "0x959e104e1a4db6317fa58f8295f586e1a978c297",
    "image": "https://api.decentraland.org/v1/parcels/13/87/map.png",
    "external_url": ""
}

GET /sandbox-ethereum-mainnet/_search
{
    "query": {
        "match_all": {}
    }
}

DELETE solanatown-solana-mainnet