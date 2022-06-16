import { Button, Checkbox, Col, Collapse, InputNumber, Row } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useState } from 'react'
import { text } from 'stream/consumers'
import { useAppDispatch } from '../../../modules/hook';
import { rCategoryFilter, rPriceMaxFilter, rPriceMinFilter, rSaleFilter, searchStart } from '../../../modules/search/search-slice';
import { AssetCategory as CategoryFilter, SaleFilter } from '../search.types';

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

const CategoryFilterOptions = [CategoryFilter.Estate, CategoryFilter.Parcel]
const SaleFilterOptions = [SaleFilter.OnSale, SaleFilter.NotOnSale]

type Props = {}
const SearchFilter = (props: Props) => {
    const dispatch = useAppDispatch()
    const [categoryFilter, setCategoryFilter] =
        useState<CheckboxValueType[]>(CategoryFilterOptions);
    const [saleFilter, setSaleFilter] =
        useState<CheckboxValueType[]>(SaleFilterOptions);

    const [priceMin, setPriceMin] = useState<number>()
    const [priceMax, setPriceMax] = useState<number>()

    const onAssetCategoryChange = (opts: CheckboxValueType[]) => {
        setCategoryFilter(opts);
        dispatch(rCategoryFilter(opts as string[]))
        dispatch(searchStart())
    }

    const onSaleFilterChange = (opts: CheckboxValueType[]) => {
        setSaleFilter(opts);
        dispatch(rSaleFilter(opts as string[]))
    }

    const onApplyPriceFilter = () => {
        dispatch(rPriceMinFilter(priceMin))
        dispatch(rPriceMaxFilter(priceMax))
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
                    <CheckboxGroup
                        options={SaleFilterOptions}
                        value={saleFilter}
                        onChange={onSaleFilterChange} />
                </Panel>
                <Panel header="Price" key="3">
                    <Row>
                        <Col>
                            <InputNumber
                                min={1}
                                max={10}
                                defaultValue={3}
                                controls={false}
                                placeholder={'Min'}
                                onChange={(v) => setPriceMin(v)} />
                        </Col>
                        <Col>to</Col>
                        <Col>
                            <InputNumber
                                min={1}
                                max={10}
                                defaultValue={3}
                                controls={false}
                                placeholder={'Max'}
                                onChange={(v) => setPriceMax(v)} />
                        </Col>
                    </Row>
                    <Row>
                        <Button onClick={onApplyPriceFilter}>Apply</Button>
                    </Row>
                </Panel>
            </Collapse>
        </>
    )
}

export default SearchFilter