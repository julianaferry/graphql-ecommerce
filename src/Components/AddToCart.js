import React, { Component } from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql'
import {CURRENT_USER_QUERY} from './User'


const ADD_TO_CART_MUTATION = gql`
    mutation addToCart($id: ID){
        addToCart(id:ID){
            id
            quantity
        }
    }
`;


 class AddToCart extends Component {
  render() {

    const{id} = this.props;

    return (
      <Mutation
      mutation={ADD_TO_CART_MUTATION}
      variables={{id}}
      refetchQueries={[ { query:CURRENT_USER_QUERY} ]}
      >
      {(addToCart, {loading}) => (
          <button disable = {loading} onClick={addToCart}>
          </button>
      )}  
      </Mutation>
    );
  }
}
export default  AddToCart;
export {ADD_TO_CART_MUTATION};