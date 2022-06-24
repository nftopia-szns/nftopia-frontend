import { Button, Checkbox, Col, Collapse, Input, InputNumber, Radio, RadioChangeEvent, Row } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../services/hook';
import { rPlatformSearchState } from '../../../services/search/search-slice';
import { DecentralandCategoryFilter, DecentralandCategoryFilterOptions, DecentralandSaleFilter, DecentralandSaleFilterOptions, DecentralandSearchState } from '../../../services/search/search.types';
import { t } from '../../../utils/translation';

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

type Props = {}

const DecentralandSearchFilter = (props: Props) => {
    const dispatch = useAppDispatch()
    const platformSearchState = useAppSelector((state) => state.search.platformSearchState as DecentralandSearchState)

    const [categoryFilter, setCategoryFilter] = useState<CheckboxValueType[]>();
    const [saleFilter, setSaleFilter] = useState<DecentralandSaleFilter>();
    const [ownerFilter, setOwnerFilter] = useState<string>()
    const [priceMin, setPriceMin] = useState<number>()
    const [priceMax, setPriceMax] = useState<number>()

    useEffect(() => {
        setCategoryFilter(platformSearchState.categoryFilter)
        setSaleFilter(platformSearchState.saleFilter)
        setOwnerFilter(platformSearchState.ownerFilter)
        setPriceMin(platformSearchState.priceMinFilter)
        setPriceMax(platformSearchState.priceMaxFilter)
    }, [platformSearchState])

    const onAssetCategoryChange = (opts: CheckboxValueType[]) => {
        setCategoryFilter(opts);
        dispatch(rPlatformSearchState({
            ...platformSearchState,
            categoryFilter: opts as DecentralandCategoryFilter[]
        }))
    }

    const onSaleFilterChange = ({ target: { value } }: RadioChangeEvent) => {
        setSaleFilter(value);
        dispatch(rPlatformSearchState({
            ...platformSearchState,
            saleFilter: value as DecentralandSaleFilter
        }))
    }

    const onApplyOwnerFilter = () => {
        if (ownerFilter && ownerFilter !== '') {
            dispatch(rPlatformSearchState({
                ...platformSearchState,
                ownerFilter: ownerFilter.toLowerCase()
            }))
        }
    }

    const onApplyPriceFilter = () => {
        dispatch(rPlatformSearchState({
            ...platformSearchState,
            priceMinFilter: priceMin,
            priceMaxFilter: priceMax,
        }))
    }

    return (
        <>
            <Collapse defaultActiveKey={['1', '2', '3', '4']}>
                <Panel header="Category" key="1">
                    <CheckboxGroup
                        value={categoryFilter}
                        onChange={onAssetCategoryChange}>
                        <Row>
                            {DecentralandCategoryFilterOptions.map((v) => <Col>
                                <Checkbox value={v}>{t(v)}</Checkbox>
                            </Col>)}
                        </Row>
                    </CheckboxGroup>
                </Panel>
                <Panel header="Sale" key="2">
                    <Radio.Group
                        onChange={onSaleFilterChange}
                        value={saleFilter}>
                        <Row>
                            {
                                DecentralandSaleFilterOptions.map((v) => <Col>
                                    <Radio value={v}>{t(v)}</Radio>
                                </Col>)
                            }
                        </Row>
                    </Radio.Group>
                </Panel>
                <Panel header="Price" key="3">
                    <Row>
                        <Col>
                            <InputNumber
                                min={1}
                                controls={false}
                                placeholder={'Min'}
                                onChange={(v) => setPriceMin(v)} />
                        </Col>
                        <Col>to</Col>
                        <Col>
                            <InputNumber
                                min={1}
                                controls={false}
                                placeholder={'Max'}
                                onChange={(v) => setPriceMax(v)} />
                        </Col>
                    </Row>
                    <Row>
                        <Button onClick={onApplyPriceFilter}>Apply</Button>
                    </Row>
                </Panel>
                <Panel header="Owner" key="4">
                    <Row>
                        <Input
                            placeholder="Filter owner..."
                            value={ownerFilter}
                            onChange={(v) => setOwnerFilter(v.target.value)} />
                    </Row>
                    <Row>
                        <Button
                            onClick={onApplyOwnerFilter}
                            disabled={!ownerFilter || ownerFilter === ''}>Apply</Button>
                    </Row>
                </Panel>
            </Collapse>
        </>
    )
}

export default DecentralandSearchFilter