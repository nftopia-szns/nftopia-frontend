import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset';
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types';
import { MetaversePlatform } from 'nftopia-shared/dist/shared/platform';
import React from 'react'
import DecentralandTradingAssetDetail from './DecentralandTradingAssetDetail';
import GenericTradingAssetDetail from './GenericTradingAssetDetail';

type Props = {
  asset: GenericAssetDto,
}

const TradingAssetDetail = (props: Props) => {
  const { asset } = props

  switch (asset.platform) {
    case MetaversePlatform.Decentraland:
      return <DecentralandTradingAssetDetail asset={asset as DecentralandAssetDto} />
    default:
      return <GenericTradingAssetDetail asset={asset}></GenericTradingAssetDetail>;
  }
}

export default TradingAssetDetail