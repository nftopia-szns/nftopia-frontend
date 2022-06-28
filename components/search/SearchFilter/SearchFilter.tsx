import { useAppSelector } from '../../../services/hook'
import { MetaversePlatform } from '../../../services/search/search.types'
import CryptovoxelsSearchFilter from './CryptovoxelsSearchFilter'
import DecentralandSearchFilter from './DecentralandSearchFilter'
import SandBoxSearchFilter from './SandBoxSearchFilter'
import SolanaTownSearchFilter from './SolanaTownSearchFilter'

type Props = {}

const SearchFilter = (props: Props) => {
    const platform = useAppSelector((state) => state.search.platform)

    switch (platform) {
        case MetaversePlatform.Decentraland:
            return <DecentralandSearchFilter />

        case MetaversePlatform.SandBox:
            return <SandBoxSearchFilter />

        case MetaversePlatform.Cryptovoxels:
            return <CryptovoxelsSearchFilter />
            
        case MetaversePlatform.SolanaTown:
            return <SolanaTownSearchFilter/>

        default:
            return null
    }
}

export default SearchFilter