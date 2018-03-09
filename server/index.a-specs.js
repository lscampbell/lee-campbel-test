const axios = require('axios');
const expect = require('chai').expect;
/**
 * API acceptance test. With testing these would always be accompanied with some unit tests for the whole outside in style of ATDD.
 */
 const port = process.env.PORT || 3000;

 describe('api', () => {
   describe('/products or /product/:id', () => {
     context('When products are returned', () => {
       let actual;

       beforeEach(() => {
         let url = `http://localhost:${port}/api/products`;
         return axios.get(url).then(response => actual = response.data.items)
       })

       it('should return 4 records', () => {
         expect(actual.length).to.be.eq(4);
       })
     })

     context('When product is returned', () => {
      let actual;

      beforeEach(() => {
        let url = `http://localhost:${port}/api/product/1095461`;
        return axios.get(url).then(response => actual = response.data.items)
      })

      it('should return 1 records', () => {
         expect(actual.length).to.be.eq(1);
      })
    })
   })
 })