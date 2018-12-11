import Link from 'next/Link'
import {Mutation } from 'react-apollo'
import {TOGGLE_CART_MUTATION} from './Cart'
import NavStyles from './styles/NavStyles'
import User from './User'
import CartCount from './CartCount'
import SignOut from './Signout'
//if the user have looged in
const Nav = () => {
    <User>
        {({ data: {me} }) => (
            <NavStyles data-test="nav">
               <Link href ="/items">
                    <a>Shop</a>
               </Link>
            {me && (
                <>
                    <Link href="/orders">
                        <a>Orders</a>
                    </Link>
                    <Link href="/orders">
                        <a>Orders</a>
                    </Link>
                    <Link href="/me">
                        <a>Account</a>
                    </Link>
                    <SignOut/>
                    <Mutation mutation = {TOGGLE_CART_MUTATION}>
                        {(toggleCart) => (
                            <button onClick={toggleCart}>
                            My Cart
                            <CartCount count={me.cart.reduce((tally, cartItem)=> tally + cartItem.quantity, 0)}></CartCount>
                            </button>
                        )}
                    </Mutation>
               </>
            )}
            
            {!me && (
                <Link href="./signup">
                    <a>Sign in</a>
                </Link>
            )}
            </NavStyles>
        )}
    </User>
};

export default Nav;