import { Button, Checkbox, Col, Collapse, InputNumber, Radio, RadioChangeEvent, Row } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useState } from 'react'
import { useAppDispatch } from '../../../modules/hook';
import { rCategoryFilter, rPriceMaxFilter, rPriceMinFilter, rSaleFilter, searchStart } from '../../../modules/search/search-slice';
import { CategoryFilter, SaleFilter } from '../search.types';

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

type Props = {}
const SearchFilter = (props: Props) => {
    const dispatch = useAppDispatch()

    const CategoryFilterOptions = Object.values(CategoryFilter)
    const SaleFilterOptions: SaleFilter[] = Object.values(SaleFilter)
    const CategoryFilterDefault = CategoryFilterOptions
    const SaleFilterDefault = SaleFilter.All

    const [categoryFilter, setCategoryFilter] =
        useState<CheckboxValueType[]>(CategoryFilterDefault);
    const [saleFilter, setSaleFilter] =
        useState<SaleFilter>(SaleFilterDefault);

    const [priceMin, setPriceMin] = useState<number>()
    const [priceMax, setPriceMax] = useState<number>()

    const onAssetCategoryChange = (opts: CheckboxValueType[]) => {
        setCategoryFilter(opts);
        dispatch(rCategoryFilter(opts as CategoryFilter[]))
        dispatch(searchStart())
    }

    const onSaleFilterChange = ({ target: { value } }: RadioChangeEvent) => {
        setSaleFilter(value);
        dispatch(rSaleFilter(value))
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