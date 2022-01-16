import {
    action,
    IReactionDisposer,
    makeAutoObservable,
    reaction,
} from 'mobx'
import * as E from 'fp-ts/Either'
import ton, { Address, Contract, Subscriber } from 'ton-inpage-provider'

import { DexConstants, TokenAbi } from '@/misc'
import {
    DEFAULT_CREATE_TOKEN_STORE_DATA,
    DEFAULT_CREATE_TOKEN_STORE_STATE,
} from '@/modules/Builder/constants'
import {
    CreateTokenFailureResult,
    CreateTokenStoreData,
    CreateTokenStoreState,
    CreateTokenSuccessResult,
    CreateTokenTransactionResult,
} from '@/modules/Builder/types'
import { saveTokenToLocalStorage } from '@/modules/Builder/utils'
import { useWallet, WalletService } from '@/stores/WalletService'


export class CreateTokenStore {

    /**
     * Current data of the creating token form
     * @type {CreateTokenStoreData}
     * @protected
     */
    protected data: CreateTokenStoreData = DEFAULT_CREATE_TOKEN_STORE_DATA

    /**
     * Current state of the creating token store
     * @type {CreateTokenStoreState}
     * @protected
     */
    protected state: CreateTokenStoreState = DEFAULT_CREATE_TOKEN_STORE_STATE

    /**
     * Last creating token transaction result data
     * @type {CreateTokenTransactionResult | undefined}
     * @protected
     */
    protected transactionResult: CreateTokenTransactionResult | undefined = undefined

    /**
     * Internal builder transaction subscriber
     * @type {Subscriber}
     * @protected
     */
    protected transactionSubscriber: Subscriber | undefined

    /**
     *
     * @param {WalletService} wallet
     */
    constructor(protected readonly wallet: WalletService = useWallet()) {
        makeAutoObservable<
            CreateTokenStore,
            | 'handleWalletAccountChange'
            | 'handleTransactionResult'
        >(this, {
            changeData: action.bound,
            createToken: action.bound,
            handleWalletAccountChange: action.bound,
            handleTransactionResult: action.bound,
        })
    }

    /**
     * Manually change store data by the given key
     * @template K
     * @param {K} key
     * @param {CreateTokenStoreData[k]} value
     */
    public changeData<K extends keyof CreateTokenStoreData>(key: K, value: CreateTokenStoreData[K]): void {
        this.data[key] = value
    }

    /**
     * Manually change store state by the given key
     * @template K
     * @param {K} key
     * @param {CreateTokenStoreState[K]} value
     */
    protected changeState<K extends keyof CreateTokenStoreState>(key: K, value: CreateTokenStoreState[K]): void {
        this.state[key] = value
    }

    public async init(): Promise<void> {
        if (this.transactionSubscriber !== undefined) {
            await this.transactionSubscriber.unsubscribe()
            this.transactionSubscriber = undefined
        }

        this.transactionSubscriber = new Subscriber(ton)

        this.#walletAccountDisposer = reaction(() => this.wallet.address, this.handleWalletAccountChange)
    }

    /**
     * Manually dispose all of the internal subscribers.
     * Clean reset creating token `data` to default values.
     */
    public async dispose(): Promise<void> {
        if (this.transactionSubscriber !== undefined) {
            await this.transactionSubscriber.unsubscribe()
            this.transactionSubscriber = undefined
        }

        this.#walletAccountDisposer?.()
        this.reset()
    }

    /**
     * Manually clean last transaction result
     */
    public cleanTransactionResult(): void {
        this.transactionResult = undefined
    }

    /**
     *
     * @param {string} [walletAddress]
     * @param {string} [prevWalletAddress]
     * @protected
     */
    protected handleWalletAccountChange(walletAddress?: string, prevWalletAddress?: string): void {
        if (walletAddress !== prevWalletAddress) {
            this.reset()
        }
    }

    /**
     * Success transaction callback handler
     * @param {CreateTokenSuccessResult['input']} input
     * @param {CreateTokenFailureResult['transaction']} transaction
     * @protected
     */
    protected handleCreateTokenSuccess({ input, transaction }: CreateTokenSuccessResult): void {
        this.transactionResult = {
            hash: transaction.id.hash,
            name: this.name,
            root: input.token_root.toString(),
            success: true,
            symbol: this.symbol,
        }

        this.changeState('isCreating', false)

        this.changeData('decimals', '')
        this.changeData('name', '')
        this.changeData('symbol', '')

        saveTokenToLocalStorage(input.token_root.toString())
    }

    /**
     * Failure transaction callback handler
     * @param _
     * @protected
     */
    protected handleCreateTokenFailure(_?: CreateTokenFailureResult): void {
        this.transactionResult = {
            success: false,
        }

        this.changeState('isCreating', false)
        this.changeData('decimals', '')
        this.changeData('name', '')
        this.changeData('symbol', '')
    }

    /**
     *
     * Manually start creating token processing
     * @returns {Promise<void>>}
     */
    public async createToken(): Promise<void> {
        if (
            !this.wallet.address
            || !this.name
            || !this.symbol
            || !this.decimals
        ) {
            this.changeState('isCreating', false)
            return
        }

        const processingId = (
            Math.floor(
                Math.random() * (100000 - 1),
            ) + 1
        ).toString()

        this.changeState('isCreating', true)

        try {
            await new Contract(TokenAbi.Factory, DexConstants.TokenFactoryAddress).methods.Token({
                answer_id: processingId,
                root_public_key: 0,
                root_owner_address: new Address(this.wallet.address),
                name: btoa(this.name),
                symbol: btoa(this.symbol),
                decimals: this.decimals,
            }).send({
                from: new Address(this.wallet.address),
                amount: '000',
            })
        }
        catch (reason) {
            this.changeState('isCreating', false)
        }

        const owner = new Contract(TokenAbi.TokenRootDeployCallbacks, new Address(this.wallet.address))

        let stream = this.transactionSubscriber?.transactions(
            new Address(this.wallet.address),
        )

        const oldStream = this.transactionSubscriber?.oldTransactions(new Address(this.wallet.address), {
            fromLt: this.wallet.contract?.lastTransactionId?.lt,
        })

        if (stream !== undefined && oldStream !== undefined) {
            stream = stream.merge(oldStream)
        }

        const resultHandler = stream?.flatMap(a => a.transactions).filterMap(async transaction => {
            const result = await owner.decodeTransaction({
                transaction,
                methods: [
                    'notifyTokenRootDeployed',
                    'notifyTokenRootNotDeployed',
                ],
            })

            if (result !== undefined) {
                if (result.method === 'notifyTokenRootNotDeployed' && result.input.answer_id.toString() === processingId) {
                    return E.left({ input: result.input })
                }

                if (result.method === 'notifyTokenRootDeployed' && result.input.answer_id.toString() === processingId) {
                    return E.right({ input: result.input, transaction })
                }
            }

            return undefined
        }).first()

        if (resultHandler !== undefined) {
            E.match(
                (r: CreateTokenFailureResult) => this.handleCreateTokenFailure(r),
                (r: CreateTokenSuccessResult) => this.handleCreateTokenSuccess(r),
            )(await resultHandler)
        }
    }

    /**
     * Reset creating token `state` to default values
     * @protected
     */
    protected reset(): void {
        this.data = {
            ...DEFAULT_CREATE_TOKEN_STORE_DATA,
        }
    }

    /**
     *
     * @returns {CreateTokenStoreData['decimals']}
     */
    public get decimals(): CreateTokenStoreData['decimals'] {
        return this.data.decimals
    }

    /**
     *
     * @returns {CreateTokenStoreData['name']}
     */
    public get name(): CreateTokenStoreData['name'] {
        return this.data.name
    }

    /**
     *
     * @returns {CreateTokenStoreData['symbol']}
     */
    public get symbol(): CreateTokenStoreData['symbol'] {
        return this.data.symbol
    }

    public get isCreating(): CreateTokenStoreState['isCreating'] {
        return this.state.isCreating
    }

    public get transaction(): CreateTokenTransactionResult | undefined {
        return this.transactionResult
    }

    #walletAccountDisposer: IReactionDisposer | undefined

}

const CreateToken = new CreateTokenStore()

export function useCreateTokenStore(): CreateTokenStore {
    return CreateToken
}
