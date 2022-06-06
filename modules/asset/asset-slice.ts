import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NFT } from '../../components/asset/DecentralandAsset/DecentralandAsset.type';
import { DecentralandSearchHitDto } from '../../components/search/search.types';

interface AssetState {
    isLoading: boolean,
    assetDetail: DecentralandSearchHitDto | object
}

export const assetInitialState: AssetState = {
    isLoading: false,
    assetDetail: null,
};

export const assetSlice = createSlice({
    name: 'asset',
    initialState: assetInitialState,
    reducers: {
        setAssetDetail(state, action: PayloadAction<DecentralandSearchHitDto>) {
            state.assetDetail = action.payload;
        },
    },
});

export const { setAssetDetail } = assetSlice.actions;
const assetReducer = assetSlice.reducer;
export default assetReducer;