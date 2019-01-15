import React from 'react'
import {Query, Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import { adopt } from './User'
import CartStyles from './Styles/CartStyles'
import Supreme from './Styles/Supreme'
import CloseButton from './Styles/CloseButton';
import ButtonStyles from './Styles/ButtonStyles';
import CartItem from './CartItem';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import TakeMyMoney from './TakeMyMoney';

const LOCAL_STATE_QUERY = gql`
    query {
        cartOpen @client
    }
`;

const TOGGLE_CART_MUTATION = gql`
    mutation {
        toggleCart @client
    }
`;
//this composed is for cleaner code
const Composed = adopt({,
    user: ({render}) => <User>{render}</User>,
    toggleCart:({render}) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
    localState: ({render})=> <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = () => (
    <Composed>
        { ({user, toggleCart, localState}) => {
            const me = user.data.me;
            if(!me) return null;
            return (
                <CartStyles open = {localState.data.cartOpen}>
                <header>
                    <CloseButton onClick={toggleCart} title="close">
                        &times;
                    </CloseButton>
                    <Supreme>{me.name}'s Cart</Supreme>
                    <p>
                        You have {me.cart.length} Item {me.cart.length === 1 ? '' : 's'} in your cart.
                    </p>
                </header>
                <ul>
                    {me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem} /> )} 
                </ul>
                <footer>
                    <p>{ formatMoney (calcTotalPrice(me.cart)) }</p>
                    {me.cart.length && (
                        <TakeMyMoney>
                            <ButtonStyles>Checkout</ButtonStyles>
                        </TakeMyMoney>
                    )}
                </footer>
            </CartStyles>
            );
        }}
    </Composed>
);

export default Cart;
export{LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION};

