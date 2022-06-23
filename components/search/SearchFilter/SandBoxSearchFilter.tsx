import { Collapse, Row, Button, Input, Checkbox } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../services/hook'
import { rPlatformSearchState } from '../../../services/search/search-slice'
import { SandBoxCategoryFilter, SandBoxLandTypeFilter, SandBoxSearchState } from '../../../services/search/search.types'
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

type Props = {}

const SandBoxSearchFilter = (props: Props) => {
    const dispatch = useAppDispatch()
    const platformSearchState = useAppSelector((state) => state.search.platformSearchState)

    const CategoryFilterOptions = Object.values(SandBoxCategoryFilter)
    const LandTypeFilterOptions = Object.values(SandBoxLandTypeFilter)
    const CategoryFilterDefault = CategoryFilterOptions
    const LandTypeFilterDefault = LandTypeFilterOptions

    const [categoryFilter, setCategoryFilter] =
        useState<CheckboxValueType[]>(CategoryFilterDefault);
    const [landTypeFilter, setLandTypeFilter] =
        useState<CheckboxValueType[]>(LandTypeFilterDefault);
    const [ownerFilter, setOwnerFilter] = useState<string>()

    useEffect(() => {
        dispatch(rPlatformSearchState({
            ...(platformSearchState as SandBoxSearchState),
            categoryFilter: CategoryFilterDefault,
            landTypeFilter: LandTypeFilterDefault,
        }))
    }, [])

    const onAssetCategoryChange = (opts: CheckboxValueType[]) => {
        setCategoryFilter(opts);
        dispatch(rPlatformSearchState({
            ...(platformSearchState as SandBoxSearchState),
            categoryFilter: opts as SandBoxCategoryFilter[]
        }))
    }

    const onLandTypeChange = (opts: CheckboxValueType[]) => {
        setLandTypeFilter(opts);
        dispatch(rPlatformSearchState({
            ...(platformSearchState as SandBoxSearchState),
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
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Category" key="1">
                    <CheckboxGroup
                        options={CategoryFilterOptions}
                        value={categoryFilter}
                        onChange={onAssetCategoryChange} />
                </Panel>
                <Panel header="Category" key="2">
                    <CheckboxGroup
                        options={LandTypeFilterOptions}
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