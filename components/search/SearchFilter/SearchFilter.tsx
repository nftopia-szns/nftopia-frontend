import { useAppSelector } from '../../../services/hook'
import { MetaversePlatform } from '../../../services/search/search.types'
import DecentralandSearchFilter from './DecentralandSearchFilter'
import SandBoxSearchFilter from './SandBoxSearchFilter'

type Props = {}

const SearchFilter = (props: Props) => {
    const platform = useAppSelector((state) => state.search.platform)

    switch (platform) {
        case MetaversePlatform.Decentraland:
            return <DecentralandSearchFilter/>

        case MetaversePlatform.SandBox:
            return <SandBoxSearchFilter/>

        default:
            return null
    }
}

export default SearchFilter