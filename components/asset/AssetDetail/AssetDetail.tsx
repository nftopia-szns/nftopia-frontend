import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { DecentralandSearchHitDto } from '../../../pages/api/search/search.types'
import { useAppSelector } from '../../../services/hook'
import { MetaversePlatform } from '../../../services/search/search.types'
import { PageHeader, Image, Spin, Button, Typography } from 'antd'
import Title from 'antd/lib/typography/Title'


type Props = {}

const AssetDetail = (props: Props) => {
    const router = useRouter()
    const { platform, index, assetId } = router.query
    const isAssetLoading = useAppSelector<boolean>((state) => state.asset.isLoading)
    const assetDetail = useAppSelector((state) => state.asset.assetDetail)

    const [isValidAsset, setIsValidAsset] = useState(true)

    useEffect(() => {
        setIsValidAsset(Object.values(MetaversePlatform).some((x) => x === platform))
    }, [platform])

    return (
        <>
            {isValidAsset && !isAssetLoading && assetDetail ?
                <>
                    <Image
                        width={200}
                        src={assetDetail["image"]}
                        placeholder={
                            <Spin spinning={!assetDetail} />
                        }
                    />
                    <>
                        <Title>{assetDetail["name"]}</Title>
                    </>
                </>
                :
                <p>invalid asset</p>
            }
        </>
    )
}

export default AssetDetail