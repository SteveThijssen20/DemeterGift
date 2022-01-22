import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'
import { Link, NavLink } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'
import { Logo } from '@/components/layout/Logo'
import { useWallet } from '@/stores/WalletService'

import './index.scss'


export function Footer(): JSX.Element {
    const intl = useIntl()
    const wallet = useWallet()

    const toolbar = (
        <div className="toolbar">
            <Observer>
                {() => (
                    <>
                        {(!wallet.isInitialized && !wallet.isInitializing) && (
                            <a
                                href="https://chrome.google.com/webstore/detail/ton-crystal-wallet/cgeeodpfagjceefieflmdfphplkenlfk"
                                className="btn btn--xl btn-tertiary footer-tool"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {intl.formatMessage({
                                    id: 'WALLET_INSTALLATION_LINK_TEXT',
                                })}
                            </a>
                        )}
                    </>
                )}
            </Observer>

        </div>
    )

    return (
        <footer className="footer">
            <div className="container container--large">
                <div className="footer__wrapper">
                    <div className="footer__left">
                        <Link to="/" className="footer-logo">
                            <Logo />
                        </Link>
                        {toolbar}
                    </div>
                    <nav className="footer-nav">
                        <div className="footer-nav__col">
                            <div className="footer-nav__col-title">
                                {intl.formatMessage({
                                    id: 'FOOTER_NAV_HEADER_PRODUCT',
                                })}
                            </div>
                            <ul className="footer-nav__list">
                                <li>
                                    <NavLink to="/swap">
                                        {intl.formatMessage({
                                            id: 'NAV_LINK_TEXT_SWAP',
                                        })}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/pools">
                                        {intl.formatMessage({
                                            id: 'NAV_LINK_TEXT_POOLS',
                                        })}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/tokens">
                                        {intl.formatMessage({
                                            id: 'NAV_LINK_TEXT_TOKENS',
                                        })}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/pairs">
                                        {intl.formatMessage({
                                            id: 'NAV_LINK_TEXT_PAIRS',
                                        })}
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/donation">
                                        Donation
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/CreateEvents">
                                        Create Events
                                    </NavLink>
                                </li>
                            </ul>
                        </div>

                    </nav>
                    <div className="footer__right">
                        {toolbar}
                    </div>
                </div>

            </div>
        </footer>
    )
}
