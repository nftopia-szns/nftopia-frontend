import { parseUnits } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Row, Col, Spin, Image, Typography, InputNumber, DatePicker, Alert } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ContractData, getContract, ContractName } from 'decentraland-transactions'
import { BigNumber } from 'ethers'
import moment, { Moment } from "moment"
import React, { useEffect, useState } from 'react'
import { BN_ZERO } from '../../../../../constants/eth'
import { ERC721Bid, IERC20, IERC20__factory, ERC721Bid__factory } from '../../../../../contracts/bid-contract/typechain-types'
import { useFingerprint } from '../../../../../modules/asset/asset-hook'
import { bidRequest } from '../../../../../modules/bid/bid-slice'
import { useAppDispatch, useAppSelector } from '../../../../../modules/hook'
import { DecentralandSearchHitDto } from '../../../../api/search/search.types'

type Props = {}

const DecentralandAssetBidPage = (props: Props) => {
  const dispatch = useAppDispatch()

  const assetDetail = useAppSelector((state) => state.asset.assetDetail as DecentralandSearchHitDto)

  const { account, provider } = useWeb3React()

  const [bidAmount, setBidAmount] = useState<number>(1000)
  const [expirationDate, setExpirationDate] = useState<Moment>(moment.utc())

  const [contractBid, setContractBid] = useState<ERC721Bid>(undefined)
  // only for estate
  const [fingerprint, isLoadingFingerprint] = useFingerprint(assetDetail)

  const [contractMana, setContractMana] = useState<IERC20>(undefined)
  const [balanceOfMana, setBalanceOfMana] = useState<BigNumber>(BN_ZERO)

  useEffect(() => {
    if (account && assetDetail) {
      const nft = assetDetail
      if (!contractMana) {
        // get info
        const contractManaData: ContractData = getContract(
          ContractName.MANAToken,
          nft.chain_id,
        )
        const _contractMana = IERC20__factory.connect(
          contractManaData.address,
          provider.getSigner(),
        )
        _contractMana.balanceOf(account).then((v) => {
          setBalanceOfMana(v)
        })
        setContractMana(_contractMana)
      }
      if (!contractBid) {
        // get info
        const contractBidData: ContractData = getContract(
          ContractName.Bid,
          nft.chain_id,
        )
        setContractBid(
          ERC721Bid__factory.connect(
            contractBidData.address,
            provider.getSigner(),
          )
        )
      }
    }
  }, [assetDetail, account, contractMana])

  const onBid = async () => {
    const priceInWei = parseUnits(bidAmount.toString(), 'ether')

    const allowance = await contractMana.allowance(account, contractBid.address)
    if (allowance.lt(priceInWei)) {
      const tx = await contractMana.approve(contractBid.address, priceInWei)
      await tx.wait()
    }

    dispatch(bidRequest({
      provider,
      asset: assetDetail,
      price: bidAmount,
      expiresAt: expirationDate.valueOf(),
      fingerprint
    }))
  }

  return (
    <>
      <Row>
        <Col span={12}>
          <Image
            preview={false}
            width={200}
            src={assetDetail?.image}
            placeholder={<Spin spinning={!assetDetail} />} />
        </Col>
        <Col span={12}>
          <Row>
            <Title>Place a bid</Title>
            <Typography>Set a price and expiration date for your bid on <b>{assetDetail?.name}</b>.</Typography>
          </Row>
          <Row>
            <InputNumber
              size="large"
              min={1}
              controls={false}
              value={bidAmount}
              onChange={(v) => { setBidAmount(v) }} />
          </Row>
          <Row>
            <DatePicker
              size="large"
              defaultValue={moment('01/01/2015', 'DD/MM/YYYY')}
              format={'DD/MM/YYYY'}
              value={expirationDate}
              onChange={(v) => setExpirationDate(v)} />
          </Row>
          {(balanceOfMana <= BN_ZERO || balanceOfMana < BigNumber.from(bidAmount)) &&
            <Row>
              <Alert message="Your balance is not enough" type="error" />
            </Row>
          }
        </Col>
      </Row>
    </>
  )
}

export default DecentralandAssetBidPage