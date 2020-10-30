import { BN } from 'ethereumjs-util'
import { Block, BlockHeader } from '@ethereumjs/block'
import { Chain } from '../../../lib/blockchain'
import { Config } from '../../../lib/config'

const defaultOptions = {
  height: 10,
}

export default class MockChain extends Chain {
  public height: any

  constructor(options: any = {}) {
    super({ config: new Config({ transports: [] }), ...options })
    options = { ...defaultOptions, ...options }
    this.height = options.height
  }

  async open() {
    if (this.opened) {
      return false
    }
    await super.open()
    await this.build()
  }

  async build() {
    const blocks: any[] = []
    for (let number = 0; number < this.height; number++) {
      blocks.push(
        Block.fromBlockData({
          header: BlockHeader.fromHeaderData({
            number: new BN(number + 1),
            difficulty: new BN(1),
            parentHash: number ? blocks[number - 1].hash() : (this.genesis as any).hash,
          }),
        })
      )
    }
    await this.putBlocks(blocks)
  }
}
