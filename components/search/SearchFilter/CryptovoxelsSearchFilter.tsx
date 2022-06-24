import { Button, Checkbox, Col, Collapse, InputNumber, Row } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../services/hook';
import { rPlatformSearchState } from '../../../services/search/search-slice';
import { CryptovoxelsIslandFilter, CryptovoxelsIslandFilterOptions, CryptovoxelsSearchState, CryptovoxelsSuburbFilter, CryptovoxelsSuburbFilterOptions } from '../../../services/search/search.types';
import { t } from '../../../utils/translation';

const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

type Props = {}

const CryptovoxelsSearchFilter = (props: Props) => {
    const dispatch = useAppDispatch()
    const platformSearchState = useAppSelector((state) => state.search.platformSearchState as CryptovoxelsSearchState)

    const [suburbFilter, setSuburbFilter] = useState<CheckboxValueType[]>();
    const [islandFilter, setIslandFilter] = useState<CheckboxValueType[]>();
    const [areaMin, setAreaMin] = useState<number>()
    const [areaMax, setAreaMax] = useState<number>()
    const [heightMin, setHeightMin] = useState<number>()
    const [heightMax, setHeightMax] = useState<number>()

    useEffect(() => {
        setSuburbFilter(platformSearchState.suburbFilter)
        setIslandFilter(platformSearchState.islandFilter)
        setAreaMin(platformSearchState.areaMinFilter)
        setAreaMax(platformSearchState.areaMaxFilter)
        setHeightMin(platformSearchState.heightMinFilter)
        setHeightMax(platformSearchState.heightMaxFilter)
    }, [platformSearchState])

    const onSuburbFilterChange = (opts: CheckboxValueType[]) => {
        setSuburbFilter(opts);
        dispatch(rPlatformSearchState({
            ...platformSearchState,
            suburbFilter: opts as CryptovoxelsSuburbFilter[]
        }))
    }

    const onIslandFilterChange = (opts: CheckboxValueType[]) => {
        setIslandFilter(opts);
        dispatch(rPlatformSearchState({
            ...platformSearchState,
            islandFilter: opts as CryptovoxelsIslandFilter[]
        }))
    }

    const onApplyAreaFilter = () => {
        dispatch(rPlatformSearchState({
            ...platformSearchState,
            areaMinFilter: areaMin,
            areaMaxFilter: areaMax,
        }))
    }

    const onApplyHeightFilter = () => {
        dispatch(rPlatformSearchState({
            ...platformSearchState,
            heightMinFilter: heightMin,
            heightMaxFilter: heightMax,
        }))
    }

    return (
        <>
            <Collapse defaultActiveKey={['1', '2', '3', '4']}>
                <Panel header="Suburb" key="1">
                    <CheckboxGroup
                        value={suburbFilter}
                        onChange={onSuburbFilterChange}>
                        <Row>
                            {CryptovoxelsSuburbFilterOptions.map((v) =>
                                <Col key={v}>
                                    <Checkbox value={v}>{t(v)}</Checkbox>
                                </Col>)}
                        </Row>
                    </CheckboxGroup>
                </Panel>
                <Panel header="Island" key="2">
                    <CheckboxGroup
                        value={islandFilter}
                        onChange={onIslandFilterChange}>
                        <Row>
                            {CryptovoxelsIslandFilterOptions.map((v) =>
                                <Col key={v}>
                                    <Checkbox value={v}>{t(v)}</Checkbox>
                                </Col>)}
                        </Row>
                    </CheckboxGroup>
                </Panel>
                <Panel header="Area" key="3">
                    <Row>
                        <Col>
                            <InputNumber
                                min={1}
                                controls={false}
                                placeholder={'Min'}
                                onChange={(v) => setAreaMin(v)} />
                        </Col>
                        <Col>to</Col>
                        <Col>
                            <InputNumber
                                min={1}
                                controls={false}
                                placeholder={'Max'}
                                onChange={(v) => setAreaMax(v)} />
                        </Col>
                    </Row>
                    <Row>
                        <Button onClick={onApplyAreaFilter}>Apply</Button>
                    </Row>
                </Panel>
                <Panel header="Height" key="4">
                    <Row>
                        <Col>
                            <InputNumber
                                min={1}
                                controls={false}
                                placeholder={'Min'}
                                onChange={(v) => setHeightMin(v)} />
                        </Col>
                        <Col>to</Col>
                        <Col>
                            <InputNumber
                                min={1}
                                controls={false}
                                placeholder={'Max'}
                                onChange={(v) => setHeightMax(v)} />
                        </Col>
                    </Row>
                    <Row>
                        <Button onClick={onApplyHeightFilter}>Apply</Button>
                    </Row>
                </Panel>
            </Collapse>
        </>
    )
}

export default CryptovoxelsSearchFilter