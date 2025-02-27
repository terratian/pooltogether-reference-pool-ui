import { atom, useAtom } from 'jotai'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { POOL_ALIASES } from 'lib/constants'
import { EMPTY_ERROR_STATE, errorStateAtom } from 'lib/components/PoolData'
import { nameToChainId } from 'lib/utils/nameToChainId'
import { WalletContext } from 'lib/components/WalletContextProvider'

export const networkAtom = atom({})

export const useNetwork = () => {
  const router = useRouter()
  const walletContext = useContext(WalletContext)
  
  const [network, setNetwork] = useAtom(networkAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)

  const poolAlias = router.query.poolAlias
  const pool = POOL_ALIASES[poolAlias]
  const networkName = pool ?
    pool.networkName :
    router.query.networkName

  const walletNetwork = walletContext._onboard.getState().network

  useEffect(() => {
    setErrorState(EMPTY_ERROR_STATE)

    if (!networkName) {
      setErrorState({
        error: true,
        errorMessage: `Network not found for path: ${window.location.pathname}.`
      })
    } else {
      setNetwork({
        name: networkName,
        id: nameToChainId(networkName),
        walletNetwork
      })
    }
  }, [poolAlias, networkName, walletNetwork])

  return network
}
