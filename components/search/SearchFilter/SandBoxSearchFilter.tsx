import { Collapse, Row, Button, Input, Checkbox } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../services/hook'
import { rPlatformSearchState } from '../../../services/search/search-slice'
import { SandBoxCategoryFilter, SandBoxCategoryFilterOptions, SandBoxLandTypeFilter, SandBoxLandTypeFilterOptions, SandBoxSearchState } from '../../../services/search/search.types'
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

type Props = {}

const SandBoxSearchFilter = (props: Props) => {
    const dispatch = useAppDispatch()
    const platformSearchState = useAppSelector((state) => state.search.platformSearchState as SandBoxSearchState)

    const CategoryFilterDefault = SandBoxCategoryFilterOptions
    const LandTypeFilterDefault = SandBoxLandTypeFilterOptions

    const [categoryFilter, setCategoryFilter] =
        useState<CheckboxValueType[]>(CategoryFilterDefault);
    const [landTypeFilter, setLandTypeFilter] =
        useState<CheckboxValueType[]>(LandTypeFilterDefault);
    const [ownerFilter, setOwnerFilter] = useState<string>()

    useEffect(() => {
        // TODO: should parse from url and dispatch to state

        // dispatch(rPlatformSearchState({
        //     ...platformSearchState,
        //     categoryFilter: CategoryFilterDefault,
        //     landTypeFilter: LandTypeFilterDefault,
        // }))
        setCategoryFilter(platformSearchState.categoryFilter)
        setLandTypeFilter(platformSearchState.landTypeFilter)
    }, [platformSearchState])

    const onAssetCategoryChange = (opts: CheckboxValueType[]) => {
        setCategoryFilter(opts);
        dispatch(rPlatformSearchState({
            ...platformSearchState,
            categoryFilter: opts as SandBoxCategoryFilter[]
        }))
    }

    const onLandTypeChange = (opts: CheckboxValueType[]) => {
        setLandTypeFilter(opts);
        dispatch(rPlatformSearchState({
            ...platformSearchState,
            landTypeFilter: opts as SandBoxLandTypeFilter[]
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

    return (
        <>
            <Collapse defaultActiveKey={['1', '2', '3']}>
                <Panel header="Category" key="1">
                    <CheckboxGroup
                        options={SandBoxCategoryFilterOptions}
                        value={categoryFilter}
                        onChange={onAssetCategoryChange} />
                </Panel>
                <Panel header="Land Type" key="2">
                    <CheckboxGroup
                        options={SandBoxLandTypeFilterOptions}
                        value={landTypeFilter}
                        onChange={onLandTypeChange} />
                </Panel>
                <Panel header="Owner" key="3">
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

export default SandBoxSearchFilter