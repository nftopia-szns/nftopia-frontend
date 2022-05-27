import { ReactNode, useState } from "react"
import { NFTopiaHeader } from "."
import "./NFTopiaLayout.module.css"

const NFTopiaLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <NFTopiaHeader />
            <div className="site-layout-content" style={{ padding: '100 50px' }}>
                {children}
            </div>
        </>
    )
}

export default NFTopiaLayout
