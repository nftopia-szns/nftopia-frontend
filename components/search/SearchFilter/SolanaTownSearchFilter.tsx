import { Collapse, Row, Col, Checkbox } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../services/hook';
import { rPlatformSearchState } from '../../../services/search/search-slice';
import { SolanaTownSearchState, SolanaTownCategoryFilter, SolanaTownCategoryFilterOptions } from '../../../services/search/search.types'
import { t } from '../../../utils/translation'

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;


type Props = {}

const SolanaTownSearchFilter = (props: Props) => {
    const dispatch = useAppDispatch()
    const platformSearchState = useAppSelector((state) => state.search.platformSearchState as SolanaTownSearchState)

    const [categoryFilter, setCategoryFilter] = useState<CheckboxValueType[]>();
    
    useEffect(() => {
        setCategoryFilter(platformSearchState.categoryFilter)
    }, [platformSearchState])

    const onSuburbFilterChange = (opts: CheckboxValueType[]) => {
        setCategoryFilter(opts);
        dispatch(rPlatformSearchState({
            ...platformSearchState,
            categoryFilter: opts as SolanaTownCategoryFilter[]
        }))
    }

    return (
        <>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Category" key="1">
                    <CheckboxGroup
                        value={categoryFilter}
                        onChange={onSuburbFilterChange}>
                        <Row>
                            {SolanaTownCategoryFilterOptions.map((v) =>
                                <Col key={v}>
                                    <Checkbox value={v}>{t(v)}</Checkbox>
                                </Col>)}
                        </Row>
                    </CheckboxGroup>
                </Panel>
            </Collapse>
        </>
    )
}

export default SolanaTownSearchFilter