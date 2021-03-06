import { Col, Row } from "antd"
import { SearchBar, SearchFilter, SearchResults } from "../../components/search"

const SearchPage = () => {
    return <>
        <Row style={{
            padding: "10px 20px",
            margin: "10px 20px",
            borderColor: "aquamarine",
            borderSpacing: "2px"
        }} justify="center">
            <SearchBar />
        </Row>
        <Row>
            <Col span={6}>
                <SearchFilter />
            </Col>
            <Col span={18}>
                <SearchResults />
            </Col>
        </Row>
    </>
}

export default SearchPage