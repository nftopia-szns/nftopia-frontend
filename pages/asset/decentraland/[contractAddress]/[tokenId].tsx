import { DecentralandAsset } from "../../../../components/asset";

import React from 'react'
import { useRouter } from "next/router";

type Props = {}

const DecentralandAssetPage = (props: Props) => {
    const router = useRouter()
    const { contractAddress, tokenId } = router.query;

    return (
        <DecentralandAsset
            contractAddress={contractAddress as string}
            tokenId={tokenId as string} />
    )
}

export default DecentralandAssetPage