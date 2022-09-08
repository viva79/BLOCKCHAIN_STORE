pragma solidity ^0.5.0;


contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product)public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased,

    );

     event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased,

     );

    constructor() public {
        name = "Viva's marketplace";
    }

    function createProduct(string memory _name, uint _price) public {
        // paramteres are correct
        // require a name
        require(bytes(_name).length > 0); 
        // require a valid price
        require(_price > 0):
        // increment productcount
        productCount ++;
        //create product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        // create trigger - notification
        emit ProductCreated(productCount, _name, _price, msg.sender, false);

}

function purchaseProduct(uint id) public payable {
    // get product
    Product memory _product = products[_id];
    // get owner
    address payable seller = _product.owner;
    // valid can I buy it make sure the product has valid id
    require(_product.id >= && _product.id <= productCount);
    // require enough etherin transaction
    require(msg.value >= _product.price);
    // make sure prod hasn t been ourchased
    require(! _product.purchased);
    // require buyer is not seller
    require(_seller != msg.sender);
    // purchase  transfer to new owner
    _product.owner = msg.sender;
    // mark as purchased
    _product.purchased = true;
    // update mapping
    products[_id] = _product;
    // pay seller via transfer Ether
    address(_seller).transfer(msg.value);
    // trigger event
      emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
}