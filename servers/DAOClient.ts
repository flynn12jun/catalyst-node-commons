import { CatalystByIdResult, getAllCatalystFromProvider } from '@zqbflynn/catalyst-contracts'
import { HTTPProvider } from 'eth-connect'
import { HttpProvider } from 'web3x/providers'

export interface DAOClient {
  // getAllContentServers(): Promise<Set<ServerMetadata>>
  // getAllServers(): Promise<Set<ServerMetadata>>
  getAllCommsServers(): Promise<Array<CatalystByIdResult>>
  getAllServers(): Promise<Array<CatalystByIdResult>>
  getAllContentServers(): Promise<Array<CatalystByIdResult>>
}

export class DAOContractClient implements DAOClient {

  constructor(private provider: HTTPProvider) {}

  async getAllCommsServers(): Promise<Array<CatalystByIdResult>> {
    const servers = await this.getAllServers()
    return servers.map((server) => ({ ...server, domain: server.domain + '/comms' }))
  }

  async getAllServers(): Promise<Array<CatalystByIdResult>> {
    return await getAllCatalystFromProvider(this.provider)
  }
  // // We will store the server metadata by id. Take into account that the id is unique, and even if we remove and re-add a domain, its id will change
  // private servers: Map<CatalystId, ServerMetadata>
  //
  // constructor(private readonly contract: DAOContract, initialServerList?: Map<CatalystId, ServerMetadata>) {
  //   this.servers = initialServerList ?? new Map()
  // }

  async getAllContentServers(): Promise<Array<CatalystByIdResult>> {
    const servers = await this.getAllServers()
    return servers.map((server) => ({ ...server, domain: server.domain + '/content' }))
  }

  // async getAllServers(): Promise<Set<ServerMetadata>> {
  //   // Check count on the list
  //   const count = await this.contract.getCount()
  //
  //   // Create a new list
  //   const newServers: Map<CatalystId, ServerMetadata> = new Map()
  //
  //   for (let i = 0; i < count; i++) {
  //     // Find id in index
  //     const id = await this.contract.getCatalystIdByIndex(i)
  //
  //     // Check if id is known
  //     let metadata = this.servers.get(id)
  //
  //     // If it isn't known, then calculate it
  //     if (!metadata) {
  //       const data = await this.contract.getServerData(id)
  //       metadata = this.toMetadata(data)
  //     }
  //
  //     // If metadata is defined, then store it
  //     if (metadata) {
  //       newServers.set(id, metadata)
  //     }
  //   }
  //
  //   this.servers = newServers
  //   return new Set(this.servers.values())
  // }

  /**
   * Converts the data from the contract into something more useful.
   * Returns undefined if the data from the contract is invalid.
   */
  // private toMetadata(data: CatalystData): ServerMetadata | undefined {
  //   const { id, owner, domain } = data
  //
  //   let baseUrl = domain.trim()
  //
  //   if (baseUrl.startsWith('http://')) {
  //     console.warn(`Catalyst node domain using http protocol, skipping ${baseUrl}`)
  //     return undefined
  //   }
  //
  //   if (!baseUrl.startsWith('https://')) {
  //     baseUrl = 'https://' + baseUrl
  //   }
  //
  //   return { baseUrl, owner, id }
  // }
}

/*
* author: flynn
* function: 用于获取对应的网络的rpc的ip
* date: 2022/10/10
* */
export const networks = {
  // todo 这里先写死，后续在考虑怎么实现
  zqb: {
    wss: '',
    http: 'http://192.168.215.27:8545'
  },
  ropsten: {
    wss: 'wss://ropsten.infura.io/ws/v3/65b4470058624aa493c1944328b19ec0',
    http: 'https://ropsten.infura.io/v3/65b4470058624aa493c1944328b19ec0'
  },
  goerli: {
    wss: 'wss://goerli.infura.io/ws/v3/65b4470058624aa493c1944328b19ec0',
    http: 'https://goerli.infura.io/v3/65b4470058624aa493c1944328b19ec0'
  },
  mainnet: {
    wss: 'wss://mainnet.infura.io/ws/v3/65b4470058624aa493c1944328b19ec0',
    http: 'https://mainnet.infura.io/v3/65b4470058624aa493c1944328b19ec0'
  }
}
export function httpProviderForNetwork(networkKey: string) {
  const network = networks[networkKey]
  const url = network.http
  return new HttpProvider(url)
}
