const express = require('express')
const Router = express.Router()

const db = require("../model");
const Product = db.product;
const Coupon = db.coupon;
const { Op } = require("sequelize");

Router.get('/api/v1.0/product/cart', async (req, res) =>{
    let cartItem = []
    let totalCartPrice = 0
    const product = Product.findAll()
    .then(data => {
        data.map((item, idx, arr)=>{
            let randomCartQuantity = Math.floor(Math.random() * (5 - 1 + 1) + 1)
            totalCartPrice += (item.productPrice * randomCartQuantity)
            cartItem.push({
              productId:item.id , 
              productName:item.productName,
              productPrice:item.productPrice,
              productQuantity:randomCartQuantity
            })   
        })
        res.send({items:cartItem,totalCartPrice});          
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
    });
})
Router.post('/api/v1.0/product/coupon', async (req, res) =>{
  const {couponCode,items,totalCartPrice} = req.body
  let discountType;
  let couponType;
  let minItem;
  let minPrice;
  let priceOff;
  let percentageOff;
  let couponCondition;
  let discountedPrice = 0;
  try {
    const coupon = await Coupon.findOne({ where: { couponCode: couponCode } });
    if (coupon === null) {
      return res.status(404).send({success:false,msg:"Invalid Coupon"})
    }
    discountType = coupon.discountType;
    couponType = coupon.couponType;
    minItem = coupon.minItem;
    minPrice = coupon.minPrice;
    priceOff = coupon.priceOff;
    percentageOff = coupon.percentageOff;
    /*
    discountType
    1 represent fixed amount off the total price 
    2 represent Percent-off total price
    3 represent Percent off or fixed amount off the total price, whichever results in the greatest discounts
    */
    couponCondition = calCouponType(couponType,minItem,minPrice,items?.length,totalCartPrice);
    if(couponCondition?.success){
    if(discountType == 1){
      discountedPrice = parseFloat(totalCartPrice) - parseInt(priceOff);
    }
      if(discountType == 2){
        discountedPrice = parseFloat(totalCartPrice) - ((percentageOff/100) * parseFloat(totalCartPrice) );
      }
      if(discountType == 3){
        let calPacentage = ((percentageOff/100) * parseFloat(totalCartPrice) )
        discountedPrice = parseFloat(totalCartPrice) - Math.max(calPacentage,priceOff)
      }
      return res.status(200).send({discountedPrice})
    }else{
      return res.status(200).send({success:false,msg:"Sorry you don't qualify for this discount"})
    }
    
   
   function calCouponType(couponType,minItem,minPrice,totalItem,totalPrice){
    // couponType
    // 1 represent ONLY PRICE TEST
    // 2 represent ONLY QUANTITY TEST
    // 3 represent PRICE TEST & QUANTITY TEST
    if(couponType === 1 && totalPrice >= minPrice){
      return {msg:"Passed Price Test", success:true}
    }else if(couponType === 2 && totalItem >= minItem){
      return {msg:"Passed QUANTITY Test", success:true}
    }else if(couponType === 3 && totalPrice >= minPrice && totalItem >= minItem){
      return {msg:"Passed QUANTITY Test", success:true}
    }else{
      return {msg:"Failed", success:false}
    }
   }
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the User."
    });
  }
})

module.exports = Router