import { Button, Checkbox, Col, Collapse, Input, InputNumber, Radio, RadioChangeEvent, Row } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../services/hook';
import { rDecentralandSearchState } from '../../../services/search/search-slice';
import { DecentralandCategoryFilter, DecentralandSaleFilter } from '../search.types';

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

type Props = {}
const SearchFilter = (props: Props) => {
    const dispatch = useAppDispatch()
    const platformSearchState = useAppSelector((state) => state.search.platformSearchState)

    const CategoryFilterOptions = Object.values(DecentralandCategoryFilter)
    const SaleFilterOptions: DecentralandSaleFilter[] = Object.values(DecentralandSaleFilter)
    const CategoryFilterDefault = CategoryFilterOptions
    const SaleFilterDefault = DecentralandSaleFilter.All

    const [categoryFilter, setCategoryFilter] =
        useState<CheckboxValueType[]>(CategoryFilterDefault);
    const [saleFilter, setSaleFilter] =
        useState<DecentralandSaleFilter>(SaleFilterDefault);

    const [ownerFilter, setOwnerFilter] = useState<string>()

    const [priceMin, setPriceMin] = useState<number>()
    const [priceMax, setPriceMax] = useState<number>()

    const onAssetCategoryChange = (opts: CheckboxValueType[]) => {
        setCategoryFilter(opts);
        dispatch(rDecentralandSearchState({
            ...platformSearchState,
            categoryFilter: opts as DecentralandCategoryFilter[]
        }))
    }

    const onSaleFilterChange = ({ target: { value } }: RadioChangeEvent) => {
        setSaleFilter(value);
        dispatch(rDecentralandSearchState({
            ...platformSearchState,
            saleFilter: value as DecentralandSaleFilter
        }))
    }

    const onApplyOwnerFilter = () => {
        if (ownerFilter && ownerFilter !== '') {
            dispatch(rDecentralandSearchState({
                ...platformSearchState,
                ownerFilter: ownerFilter.toLowerCase()
            }))
        }
    }

    const onApplyPriceFilter = () => {
        dispatch(rDecentralandSearchState({
            ...platformSearchState,
            priceMinFilter: priceMin,
            priceMaxFilter: priceMax,
        }))
    }

    return (
        <>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Category" key="1">
                    <CheckboxGroup
                        options={CategoryFilterOptions}
                        value={categoryFilter}
                        onChange={onAssetCategoryChange} />
                </Panel>
                <Panel header="Sale" key="2">
                    <Radio.Group
                        onChange={onSaleFilterChange}
                        value={saleFilter}
                        options={SaleFilterOptions}>
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

export default SearchFilter