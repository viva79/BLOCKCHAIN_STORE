import React, { Component } from 'react';
import logo from '../logo.png';
import Web3 from 'web3'
import './App.css';
import MarketPlace from "../abis/Marketplace.json"
import Navbar from './Navbar.js';
import Main from './Main.js';

class App extends Component {

  async componentWillmount() {
    await this.loadWeb3()
    await this.loadBlockchainData()

    // console.log(window.loadWeb3)
  }
  
  async loadWeb3() {
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
      }
      else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
      }
      // Non-dapp browsers...
      else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }

    async loadBlockchainData() {
      const web3 = window.web3

      const accounts = await webs3.eth.getAccounts()
      // console.log(accounts)
      this.setState ({account : accounts[0]})
      // console.log(Marketplace.abi, Marketplace.networks[5777].address)
      const networkId = await web3.eth.net.getId()
      // console.log(networkId)
      const networkData = Marketplace.networks[networkId]
      if (networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      // console.log(marketplace)
      this.setState({ marketplace })
      const productCount = await this.state.marketplace.methods.productCount.call()
      this.setState({ productCount })
      // console.log(productCount.toString())
       // Load products
       for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()  // call (no ether, only view)
        this.setState({
          products: [...this.state.products, product]  // add product tt array of products
        })
      }
      this.setState({loading : false })
      // console.log(this.state.products)
      } else {
          
      }
      
    }

    constructor(props) {
      super(props)
      this.state = { 
        account: '',
        productCount: 0,
        products:[],
        loading: true
    }

    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
  }


    createProduct(name, price) {
      this.setstate.loading({ loading: true })
      this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
    }

   purchaseProduct(id, price) {
      this.setstate.loading({ loading: true })
      this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
    }
    


    // account ={this.state.account}  via props  fill in account
    // createProduct ={this.createProduct}  via props provide function

  render() {
    return (
      <div>
        < Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
           <main role="main" className='col-lg-12 d-flex'>
            { this.state.loading 
            ? <div id="loader" className="text-center"><p className='text-center'> loading..</p></div> 
            : <Main 
              products={this.state.products}
              createProduct={this.createProduct}
              purchaseProduct={this.purchaseProduct} />
        } 
        </main>
        </div>
      </div>
    </div>
    );
   }
  }
   

export default App;

