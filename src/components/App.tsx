import * as React from 'react'
import { IntlProvider } from 'react-intl'
import {
    Redirect,
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { WalletConnectingModal } from '@/components/common/WalletConnectingModal'
import { WalletUpdateModal } from '@/components/common/WalletUpdateModal'
import { Header } from '@/components/layout/Header'
import messages from '@/lang/en'
import { Account } from '@/modules/Account'
import Builder from '@/pages/builder'
import CreateToken from '@/pages/builder/create'
import CustomToken from '@/pages/builder/token'
import Pairs from '@/pages/pairs'
import Pair from '@/pages/pairs/item'
import AddLiquidityPool from '@/pages/pool'
import Swap from '@/pages/swap'
import Tokens from '@/pages/tokens'
import Token from '@/pages/tokens/item'
import Pools from '@/pages/pools'
import Pool from '@/pages/pools/item'
import BurnLiquidity from '@/pages/pools/burn-liquidity'
import { noop } from '@/utils'
import { appRoutes } from '@/routes'
import Home from '@/pages/Home'
import CreateEvents from '@/pages/CreateEvents'
import Donation from '@/pages/donation'
import Auction from '@/pages/donation/auction'
import './App.scss'


export function App(): JSX.Element {
    return (
        <IntlProvider
            key="intl"
            locale="en"
            defaultLocale="en"
            messages={messages}
            onError={noop}
        >
            <Router>
                <div className="wrapper">
                    <Header key="header" />
                    <main className="main">
                        <Switch>
                            <Route exact path="/">
                                <Home />
                            </Route>
                            <Route exact path="/CreateEvents">
                                <CreateEvents />
                            </Route>
                            <Route exact path="/donation">
                                <Donation />
                            </Route>
                            <Route exact path='/donation/auction'>
                                <Auction />
                            </Route>

                            <Route path={appRoutes.swap.path}>
                                <Swap />
                            </Route>

                            <Route exact path={appRoutes.poolList.path}>
                                <Pools />
                            </Route>
                            <Route exact path={appRoutes.poolRemoveLiquidity.path}>
                                <BurnLiquidity />
                            </Route>
                            <Route exact path={appRoutes.poolItem.path}>
                                <Pool />
                            </Route>
                            <Route exact path={appRoutes.poolCreate.path}>
                                <AddLiquidityPool />
                            </Route>

                            <Route exact path={appRoutes.tokenList.path}>
                                <Tokens />
                            </Route>
                            <Route exact path={appRoutes.tokenItem.path}>
                                <Token />
                            </Route>

                            <Route exact path={appRoutes.pairList.path}>
                                <Pairs />
                            </Route>
                            <Route exact path={appRoutes.pairItem.path}>
                                <Pair />
                            </Route>

                            <Route exact path={appRoutes.builder.path}>
                                <Builder />
                            </Route>
                            <Route path={appRoutes.builderCreate.path}>
                                <CreateToken />
                            </Route>
                            <Route exact path={appRoutes.builderItem.path}>
                                <CustomToken />
                            </Route>

                        </Switch>
                    </main>
                    <Footer key="footer" />
                </div>
                <div className="wallets">
                    <Account key="account" />
                    <WalletConnectingModal />
                    <WalletUpdateModal />
                </div>
            </Router>
        </IntlProvider>
    )
}
