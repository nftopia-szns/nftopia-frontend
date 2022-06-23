import { useAppSelector } from '../../../services/hook'
import { MetaversePlatform } from '../search.types'
import DecentralandSearchFilter from './DecentralandSearchFilter'

type Props = {}

const SearchFilter = (props: Props) => {
    const platform = useAppSelector((state) => state.search.platform)

    switch (platform) {
        case MetaversePlatform.Decentraland:
            return <DecentralandSearchFilter/>

        case MetaversePlatform.SandBox:
            return null

        default:
            return null
    }
}

export default SearchFilter