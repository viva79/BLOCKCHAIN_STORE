const Marketplace = artifacts.require('./Marketplace.sol')

require (' chai')
    use(require('chai-as-promised'))
    should()

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace

    before(async () => {
        marketplace = await Marketplace.deployed()
        
    })

    describe('deployment', async() => {
        it('deploys succesfully', async () => {
            const address = await marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, "")
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)

        })
        it('has a name', async () => {
            const name = await marketplace.name
            assert.equal(name, "viva's marketplace")

    })
})



describe('products', async() => {
    let result, productCount
    before(async () => {
        result = await marketplace.createProduct('iphone 8', web3.utils toWei('1', 'Ether'), { from : seller })
        productCount = await marketplace.productCount()
  
    })
    // Success

    it('creates products', async () => {
        assert.equal(productCount, 1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), productCount.toNumber, 'id is correct')
        assert.equal(event.name, 'iphone 8','name is correct')
        assert.equal(event.price, '1000000000000000000' , 'price is correct')
        assert.equal(event.owner, seller,  'is correct')
        assert.equal(event.purchased, false,  'is correct')
    })

    // failures
    await await marketPlace.createProduct('', web3.utils.toWei('1', 'Ether'), {from:seller}).should.be.rejected;
    await await marketPlace.createProduct('iphone 8',0, {from:seller}).should.be.rejected;
})

it('lists products',async () => {
    const product = await marketplace.products(productCount)
    assert.equal(product.id.toNumber(), productCount.toNumber, 'id is correct')
    assert.equal(product.name, 'iphone 8','name is correct')
    assert.equal(product.price, '1000000000000000000' , 'price is correct')
    assert.equal(product.owner, seller,  'is correct')
    assert.equal(product.purchased, false,  'is correct')

})

it('sells products', async () => {
    // track seller balance before purchase
    let oldSellerBalance
    oldSellerBalance = await web3.eth.getBalance(seller)
    oldSellerBalance = new web3.utils.BN(oldSellerBalance)

   // Success buyer makes purchase
   result = await marketplace.purchaseProduct(productCount, { from: buyer, value:web3.utils.toWei('1', 'Ether') })
   
   // check logs
   const event = result.logs[0].args
   assert.equal(event.id.toNumber(), productCount.toNumber, 'id is correct')
   assert.equal(event.name, 'iphone 8','name is correct')
   assert.equal(event.price, '1000000000000000000' , 'price is correct')
   assert.equal(event.owner, buyer,  'is correct')
   assert.equal(event.purchased, true,  'is correct')

   // check seller got paid
   let newSellerBalance = 
   newSellerBalance = await web3.eth.getBalance(seller)
   newSellerBalance = new web3.utils.BN(newSellerBalance)

   let price
   price = web3.utils.toWei('1', 'Ether')
   price = new web3.utils.BN(price)

   // console.log(oldSellerBalance, newSellerBalance, price)

   const expectedBalance = oldSellerBalance.add(price)

   assert.equal(newSellerBalance.toString(), expectedBalance.toString())

   // FAILURE
   // product must have valid id
   await marketplace.purchaseProduct(99, { from: buyer, value:web3.utils.toWei('1', 'Ether') }).should.be.rejected
    // not enough ether
    await marketplace.purchaseProduct(productCount, { from: buyer, value:web3.utils.toWei('0.5', 'Ether') }).should.be.rejected
   // can t buy twice
   await marketplace.purchaseProduct(productCount, { from: deployer, value:web3.utils.toWei('1', 'Ether') }).should.be.rejected
    // buyer can t be seller
    await marketplace.purchaseProduct(productCount, { from: buyer, value:web3.utils.toWei('1', 'Ether') }).should.be.rejected



})

})